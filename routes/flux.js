const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.routes = {
  name: "Flux Image Generator",
  desc: "Generates images based on a prompt using the FLUX model.",
  category: "AI IMAGE GENERATOR",
  usages: "/api/flux",
  query: "?prompt=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt parameter is required' });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      { inputs: prompt },
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    const filePath = path.join(__dirname, "preview.png");
    fs.writeFileSync(filePath, response.data);

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Failed to send file:", err);
        res.status(500).json({ error: "Error sending image" });
      }
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Error generating image" });
  }
};
