const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function aiArtGenerator(prompt) {
  try {
    const formData = new URLSearchParams({
      prompt: prompt,
      output_format: "bytes",
      user_profile_id: "null",
      anonymous_user_id: "a584e30d-1996-4598-909f-70c7ac715dc1",
      request_timestamp: Date.now(),
      user_is_subscribed: "false",
      client_id: "pSgX7WgjukXCBoYwDM8G8GLnRRkvAoJlqa5eAVvj95o",
    });

    const response = await axios.post(
      "https://ai-api.magicstudio.com/api/ai-art-generator",
      formData.toString(),
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Accept-Language": "en-US,en;q=0.9",
          Origin: "https://magicstudio.com",
          Referer: "https://magicstudio.com/ai-art-generator/",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        responseType: "arraybuffer",
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports.routes = {
  name: "Magic Studio AI Art Generator",
  desc: "Generates AI art based on a prompt and sends the image as a file.",
  category: "AI IMAGE GENERATOR",
  usages: "/api/generate-art",
  query: "?prompt=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const prompt = req.query.prompt;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const filePath = path.join(__dirname, "art.png");

  try {
    const aiArt = await aiArtGenerator(prompt);
    fs.writeFileSync(filePath, Buffer.from(aiArt, "utf8"));

    // Send the file directly in the response
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
