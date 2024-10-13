const axios = require('axios');

module.exports.routes = {
  name: "Roasted AI",
  desc: "Response a roast based on a prompt.",
  category: "AI Tools",
  usages: "/api/roasted-ai",
  query: "?prompt=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).send('Please provide a prompt.');
  }

  const url = 'https://roastedby.ai/api/generate';
  const requestData = {
    userMessage: {
      role: 'user',
      content: prompt
    },
    history: [],
    style: 'adult'
  };

  try {
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.send(response.data.content);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
};
