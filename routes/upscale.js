const express = require("express");
const { upscale } = require("nayan-server");
const router = express.Router();

module.exports.routes = {
  name: "Upscaler Image",
  desc: "Upscales images using specified model chose 1 or 2",
  category: "Tools",
  usages: "/api/upscale",
  query: "?url=https://files.catbox.moe/w5m8y3.jpg&model=1",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const { url, model = "1" } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Image URL is required." });
  }

  try {
    const data = await upscale(url, model);
    const filteredData = {
      image_url: data.image_url,
    };
    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "Upscaling failed.", details: error.message });
  }
};
