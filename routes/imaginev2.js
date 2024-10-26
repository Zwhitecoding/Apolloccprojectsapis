const express = require("express");
const axios = require("axios");
const { imagine } = require("nayan-server");
const router = express.Router();

module.exports.routes = {
  name: "Imagine AI V2",
  desc: "Generates an image based on a prompt",
  category: "AI IMAGE GENERATOR",
  usages: "/api/imaginev2",
  query: "?prompt=<prompt-text>",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const data = await imagine(prompt);
    const imageUrl = data.image_url;
    const response = await axios.get(imageUrl, { responseType: "stream" });

    res.setHeader("Content-Type", "image/png");
    response.data.pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Image generation failed.", details: error.message });
  }
};
