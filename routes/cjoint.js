const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();

module.exports.routes = {
  name: "Cjoint Uploader",
  desc: "Uploads files to Cjoint and returns the shareable link",
  category: "File Management",
  usages: "/api/cjoint",
  query: "?url=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
    const fileUrl = req.originalUrl.split('/api/cjoint?url=')[1];

    if (!fileUrl) {
        return res.status(400).json({ error: 'No URL provided' });
    }

    try {
        const timestamp = Date.now();
        const fileFormat = path.extname(fileUrl).substring(1); 
        const fileName = `ccproject-${timestamp}.${fileFormat}`;
        const outputFilePath = path.join(__dirname, fileName);
        await downloadFile(fileUrl, outputFilePath);

        const instance = axios.create({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
            baseURL: 'https://www.cjoint.com/',
        });

        const uploadUrl = await getUploadUrl(instance);
        const uploadResponse = await uploadFile(outputFilePath, uploadUrl, instance);
        const cjointLink = await getCjointLink(uploadResponse);
        const finalUrl = await getFinalUrl(cjointLink);

        fs.unlink(outputFilePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File deleted successfully');
            }
        });

        res.json({ url: finalUrl });
    } catch (error) {
        console.error('Error processing URL:', error);
        res.status(500).send('Error processing URL');
    }
};

async function getUploadUrl(instance) {
    const response = await instance.get('/');
    const $ = cheerio.load(response.data);
    return $('#form-upload').attr('action');
}

async function downloadFile(url, outputPath) {
    try {
        const response = await axios.get(url, { responseType: 'stream' });
        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', async () => {
                try {
                    const arrayBufferResponse = await axios.get(url, { responseType: 'arraybuffer' });
                    fs.writeFileSync(outputPath, Buffer.from(arrayBufferResponse.data));
                    resolve();
                } catch (error) {
                    reject(new Error('Failed to download file with both stream and arraybuffer'));
                }
            });
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        throw new Error('Failed to download file');
    }
}

async function uploadFile(filePath, uploadUrl, instance) {
    const formData = new FormData();
    formData.append('USERFILE', fs.createReadStream(filePath));

    const response = await instance.post(uploadUrl, formData, {
        headers: formData.getHeaders(),
    });
    return response.data;
}

async function getCjointLink(uploadResponse) {
    const $ = cheerio.load(uploadResponse);
    const link = $('.share_url a').attr('href');
    return link;
}

async function getFinalUrl(cjointLink) {
    const instance = axios.create({
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        baseURL: cjointLink,
    });

    try {
        const htmlResponse = await instance.get('/');
        const html$ = cheerio.load(htmlResponse.data);
        const shareUrl = html$('.share_url a').attr('href');
        const finalUrl = `https://www.cjoint.com${shareUrl.split('"')[0]}`;
        return finalUrl;
    } catch (error) {
        console.error('Error getting final URL:', error);
        throw error;
    }
}
