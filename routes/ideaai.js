const axios = require('axios');

module.exports.routes = {
    name: "Idea Generator",
    desc: "Generate ideas based your prompt",
    category: "AI Tools",
    query: "?prompt=",
    usages: "/api/idea",
    method: "get",
};

const ideaGen = async (prompt) => {
  try {
    const response = await axios.post("https://www.ideagenerator.ai/api/generate", {
      ideasFor: prompt,
      gpt4Enabled: true
    }, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36",
        Referer: "https://www.ideagenerator.ai/?ref=taaft&utm_source=taaft&utm_medium=referral"
      }
    });

    const res = response.data;
    const ideas = res
      .match(/{"ideasContent":"(.*?)"}/g) 
      .map(part => {
        return part.match(/{"ideasContent":"(.*?)"}/)[1]; 
      })
      .join("");
    return ideas;
  } catch (error) {
    console.error(error.message);
    return "";
  }
};

module.exports.onAPI = async (req, res) => {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt parameter' });
  }

  const result = await ideaGen(prompt);

  if (!result) {
    return res.status(500).json({ error: 'Error generating ideas' });
  }

  res.json({ summarized: result });
};
