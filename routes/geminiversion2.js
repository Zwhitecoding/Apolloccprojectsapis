const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKeys = [
  "AIzaSyBAEiDoFt0no4m_rvuWnAdqj8TzPPSoESs",
  "AIzaSyAgZgBukaiCxWlm-P7zo9tmOM9499BsJp4", 
  "AIzaSyArWBkp8T1izTH5Gfbgk5DFfBILkwoBAnc",
  "AIzaSyDDI6Uaond8rN4o4-iDOwKeWEaqq_Srl3Q",
  "AIzaSyDOYoqSMxnoL-JtCdtOWhfaS6swm2xC7TA"
];

const API_KEY = apiKeys[Math.floor(Math.random() * apiKeys.length)];

if (!API_KEY) {
  console.error("API_KEY is not set.");
  process.exit(1);
}

module.exports.routes = {
  name: "Gemini Version Pro Flash 1.5",
  desc: "Generates a description of the image using Google's Gemini AI.",
  category: "AI Tools",
  usages: "/api/geminiversion2",
  query: "?ask=&imagurl=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const { ask, imagurl } = req.query;

  if (!ask || !imagurl) {
    return res.status(400).json({ error: 'Both ask and imagurl parameters are required.' });
  }

  try {
    const imageResponse = await axios.get(imagurl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://facebook.com'
      }
    });

    const image = {
      inlineData: {
        data: Buffer.from(imageResponse.data).toString("base64"),
        mimeType: "image/jpeg",
      },
    };

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([ask, image]);

    res.json({
      description: result.response.text(),
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: 'An error occurred while processing the request.',
      details: error.message,
    });
  }
};
