const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');
const router = express.Router();

module.exports.routes = {
  name: 'File CC Uploader',
  desc: 'Download a file from a given URL and upload it to a CC file host',
  category: 'File Management',
  usages: '/api/ccupload',
  query: '?url=',
  method: 'get',
};

module.exports.onAPI = async (req, res) => {
const url = req.originalUrl.split('/api/ccupload?url=')[1];;

  if (!url) {
    return res.status(400).json({ error: 'File URL is required.' });
  }

  let response, filePath;
  const fileName = path.basename(url);

  try {
    try {
      response = await axios.get(url, { responseType: 'arraybuffer' });
      filePath = `./${fileName}`;
      fs.writeFileSync(filePath, response.data);
    } catch (arrayBufferError) {
      try {
        response = await axios.get(url, { responseType: 'stream' });
        filePath = `./tmp/${fileName}`;
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
      } catch (streamError) {
        return res.status(500).json({ error: 'Failed to download the file. Please check the URL.' });
      }
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const uploadResponse = await axios.post('https://joncll.serv00.net/upload.php', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'File uploaded successfully!',
      uploadResponse: uploadResponse.data,
    });
  } catch (error) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(500).json({
      error: 'An error occurred while processing the file.',
      details: error.message,
    });
  }
};
