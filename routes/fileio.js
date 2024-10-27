const express = require('express');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

const app = express();
const uploadUrl = 'https://file.io/';
const uploadHeaders = { Accept: 'application/json, text/plain, */*' };

module.exports.routes = {
  name: "Fileio Uploader",
  desc: "Uploads files to file.io from a given URL",
  category: "Tools",
  usages: "/fileio",
  query: "?url=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
    const fileUrl = req.originalUrl.split('/api/fileio?url=')[1];;

    if (!fileUrl) {
        return res.status(400).send('File URL is required.');
    }

    const originalFileName = path.basename(fileUrl);
    const fileExtension = path.extname(originalFileName);
    const timestamp = Date.now();
    const newFileName = `ccproject-fileio-${timestamp}${fileExtension}`;

    try {
        const response = await axios({
            method: 'get',
            url: fileUrl,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(newFileName);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            try {
                const form = new FormData();
                const fileStream = fs.createReadStream(newFileName);
                form.append('file', fileStream);
                form.append('title', newFileName);

                const uploadResponse = await axios.post(uploadUrl, form, {
                    headers: {
                        ...uploadHeaders,
                        ...form.getHeaders()
                    }
                });

                fs.unlinkSync(newFileName);
                res.json(uploadResponse.data);
            } catch (uploadError) {
                console.error('Error uploading file:', uploadError.response ? uploadError.response.data : uploadError.message);
                res.status(500).send('Error uploading file.');
            }
        });

        writer.on('error', async () => {
            try {
                const arrayBufferResponse = await axios({
                    method: 'get',
                    url: fileUrl,
                    responseType: 'arraybuffer'
                });

                fs.writeFileSync(newFileName, Buffer.from(arrayBufferResponse.data));

                const form = new FormData();
                const fileStream = fs.createReadStream(newFileName);
                form.append('file', fileStream);
                form.append('title', newFileName);

                const uploadResponse = await axios.post(uploadUrl, form, {
                    headers: {
                        ...uploadHeaders,
                        ...form.getHeaders()
                    }
                });

                fs.unlinkSync(newFileName);
                res.json(uploadResponse.data);
            } catch (error) {
                console.error('Error downloading file as ArrayBuffer:', error.response ? error.response.data : error.message);
                res.status(500).send('Error downloading file.');
            }
        });
    } catch (downloadError) {
        console.error('Error downloading file:', downloadError.response ? downloadError.response.data : downloadError.message);
        res.status(500).send('Error downloading file.');
    }
};
