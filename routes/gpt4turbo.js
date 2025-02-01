const axios = require('axios');

module.exports.routes = {
  name: "GPT-3",
  desc: "Get responses from GPT-3",
  category: "AI Tools",
  query: "?ask=hi",
  usages: "/api/gpt3",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const ask = req.query.ask;

  if (!ask) {
    return res.status(400).json({ message: "Please provide a valid question." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?prompt=you as assist ai&content=${ask}`);
    if (response.data.status) {
      const answer = response.data.data;

      res.json({ data: answer });
    } else {
      res.status(400).json({ message: "Failed to get GPT-3 response." });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
