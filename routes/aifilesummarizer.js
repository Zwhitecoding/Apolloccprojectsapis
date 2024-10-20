const express = require('express');
const axios = require('axios');
const mime = require('mime-types');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const excelToJson = require('convert-excel-to-json');
const pptxToJson = require('pptx2json');

const app = express();

module.exports.routes = {
    name: "Summarize Files",
    desc: "Summarize your file like docx, exce, pdf, and pttx file using url file link",
    category: "AI Tools",
    query: "?link=&id=",
    usages: "/api/aisum",
    method: "get",
};

const downloadAndProcessFile = async (url, id) => {
    try {
        const { data: fileBuffer, headers } = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0',
            },
        });

        const fileType = mime.extension(headers['content-type']);
        let text = '';

        if (!fileType) throw new Error('File type could not be determined');

        if (fileType === 'pdf') {
            const pdfData = await pdfParse(fileBuffer);
            text = pdfData.text;
        } else if (fileType === 'docx') {
            const { value: docxText } = await mammoth.extractRawText({ buffer: fileBuffer });
            text = docxText;
        } else if (fileType === 'xlsx' || fileType === 'xls') {
            await fs.writeFile('temp.xlsx', fileBuffer);
            const excelData = excelToJson({ sourceFile: 'temp.xlsx' });
            text = JSON.stringify(excelData);
            await fs.unlink('temp.xlsx');
        } else if (fileType === 'pptx') {
            await fs.writeFile('temp.pptx', fileBuffer);
            const pptxData = await pptxToJson('temp.pptx');
            text = JSON.stringify(pptxData);
            await fs.unlink('temp.pptx');
        } else {
            return { error: 'Unsupported file format' };
        }

        const apiUrl = `https://ccprojectapis.ddns.net/api/gptconvo?ask=You're now the summarize AI and give one by one summarize and clearly to the user of this text: ${encodeURIComponent(text)}&id=${id}`;
        const response = await axios.get(apiUrl);

        return response.data;
    } catch (err) {
        return { error: err.message };
    }
};

module.exports.onAPI = async (req, res) => {
    const { link, id } = req.query;

    if (!link || !id) {
        return res.status(400).json({ error: 'Missing link or id parameter' });
    }

    const result = await downloadAndProcessFile(link, id);

    if (result.error) {
        return res.status(500).json({ error: result.error });
    }

    res.json(result); 
};
