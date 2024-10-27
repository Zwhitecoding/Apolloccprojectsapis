const express = require("express");
const { upscale } = require("nayan-server");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const router = express.Router();

module.exports.routes = {
  name: "Upscaler Image",
  desc: "Upscales images using default model 1.",
  category: "Tools",
  usages: "/api/upscale",
  query: "?url=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const url = req.originalUrl.split('/api/upscale?url=')[1];

  if (!url) {
    return res.status(400).json({ error: "Image URL is required." });
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    const model = "1"; 

    const data = await upscale(decodedUrl, model);
    const response = await axios.get(data.image_url, { responseType: "arraybuffer" });
    const tempFilePath = path.join(__dirname, "temp_upscaled_image.jpg");
    fs.writeFileSync(tempFilePath, response.data);

    res.sendFile(tempFilePath, (err) => {
      if (err) {
        res.status(500).json({ error: "File sending failed.", details: err.message });
      } else {
        fs.unlinkSync(tempFilePath);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Upscaling failed.", details: error.message });
  }
};
