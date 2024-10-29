const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const HUGGING_FACE_API_KEY = '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';

module.exports.routes = {
  name: "Emotion Detector",
  desc: "Detects emotions based on an image URL.",
  category: "AI Tools",
  usages: "/api/emotiondetector",
  query: "?url=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const imageUrl = req.originalUrl.split('/api/emotiondetector?url=')[1];

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL parameter is required' });
  }

  try {
    const imagePath = path.join(__dirname, "downloaded_image.jpg");


    const downloadImage = async (url) => {
      const response = await axios.get(url, { responseType: 'stream' });
      response.data.pipe(fs.createWriteStream(imagePath));
      return new Promise((resolve, reject) => {
        response.data.on('end', () => resolve(imagePath));
        response.data.on('error', reject);
      });
    };

    await downloadImage(imageUrl);

    const image = fs.readFileSync(imagePath);
    const detectionResponse = await axios.post(
      'https://api-inference.huggingface.co/models/dima806/facial_emotions_image_detection',
      image,
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
      }
    );

    fs.unlinkSync(imagePath);

    const emotions = detectionResponse.data.map(emotion => ({
      label: emotion.label,
      percentage: (emotion.score * 100).toFixed(2) + '%'
    }));

    const highestEmotion = emotions.reduce((max, emotion) =>
      parseFloat(emotion.percentage) > parseFloat(max.percentage) ? emotion : max
    );

    res.json({ emotions, result: `Probability Emotion is ${highestEmotion.label}` });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: "Error detecting emotions" });
  }
};
