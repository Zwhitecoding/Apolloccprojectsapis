const express = require("express");
const { upscale } = require("nayan-server");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const router = express.Router();

module.exports.routes = {
  name: "Upscaler Image",
  desc: "Upscales images using specified model. Choose model 1 or 2.",
  category: "Tools",
  usages: "/api/upscale",
  query: "?url=<encodedURL>&model=1",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  let { url, model = "1" } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Image URL is required." });
  }

  try {
    
    url = decodeURIComponent(url);


    const data = await upscale(url, model);
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
