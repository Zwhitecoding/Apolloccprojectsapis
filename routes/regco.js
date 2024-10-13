const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.routes = {
  name: "Recognize Music",
  desc: "Downloads a music file from a given URL and recognizes the track using the Audd API.",
  category: "Tools",
  usages: "/api/recog",
  query: "?url=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const fileUrl = req.originalUrl.split('/recog?url=')[1];

  if (!fileUrl) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  const filePath = path.join(__dirname, 'downloaded.mp3');
  const writer = fs.createWriteStream(filePath);

  try {
    const response = await axios({
      method: 'get',
      url: fileUrl,
      responseType: 'stream'
    });

    response.data.pipe(writer);

    writer.on('finish', async () => {
      try {
        const auddData = {
          'api_token': 'fdb1d58242a7472c5d425f4c277a09f6',
          'file': fs.createReadStream(filePath),
          'return': 'apple_music,spotify',
        };

        const auddResponse = await axios({
          method: 'post',
          url: 'https://api.audd.io/',
          data: auddData,
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        res.json(auddResponse.data);

        fs.unlinkSync(filePath);
      } catch (auddError) {
        res.status(500).json({ error: 'Error recognizing audio', details: auddError.message });
      }
    });

    writer.on('error', () => {
      res.status(500).json({ error: 'Error downloading file' });
    });

  } catch (error) {
    res.status(500).json({ error: 'Error processing request', details: error.message });
  }
};
