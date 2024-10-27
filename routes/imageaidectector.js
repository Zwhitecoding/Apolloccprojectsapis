module.exports.routes = {
  name: "AI Image Detector",
  desc: "Detects if an image is AI-generated or human-created",
  category: "AI Tools",
  usages: "/api/aidec",
  query: "?url=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const url = req.originalUrl.split('/api/aidec?url=')[1];

  if (!url) {
    return res.status(400).json({ error: "Please provide an image URL using the 'url' query parameter." });
  }

  try {
    const result = await processImageFromURL(url);
    res.json(result);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Error classifying image from URL." });
  }
};

// Helper functions
const axios = require("axios");
const fs = require("fs");
const HF_API_URL = "https://api-inference.huggingface.co/models/umm-maybe/AI-image-detector";
const HF_API_TOKEN = "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";

async function classifyImage(filePath) {
  const imageData = fs.readFileSync(filePath);

  try {
    const response = await axios.post(HF_API_URL, imageData, {
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/octet-stream",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    throw new Error("Image classification failed");
  }
}

async function downloadImage(url) {
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "arraybuffer",
    });
    const filePath = "./temporary_img.jpeg";
    fs.writeFileSync(filePath, response.data);
    return filePath;
  } catch (error) {
    console.error("Error downloading image:", error);
    throw new Error("Failed to download image");
  }
}

async function processImageFromURL(url) {
  const filePath = await downloadImage(url);
  const results = await classifyImage(filePath);

  const artificialPercentage = (results.find(r => r.label === "artificial")?.score || 0) * 100;
  const humanPercentage = (results.find(r => r.label === "human")?.score || 0) * 100;

  const classification = artificialPercentage > humanPercentage
    ? "The image is likely AI-generated."
    : "The image is likely human-created.";

  fs.unlinkSync(filePath);

  return {
    artificial: `${artificialPercentage.toFixed(2)}%`,
    human: `${humanPercentage.toFixed(2)}%`,
    classification
  };
      }
  
