const axios = require('axios');

module.exports.routes = {
  name: "LLaMA 33",
  desc: "Get responses from LLaMA 33 model",
  category: "AI Tools",
  query: "?ask=your-question",
  usages: "/api/llama",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const ask = req.query.ask;

  if (!ask) {
    return res.status(400).json({ message: "Please provide a valid question." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/ai/llama33?prompt=Be%20a%20helpful%20assistant&text=${ask}`);
    if (response.data.status) {
      const answer = response.data.data;

      res.json({ data: answer });
    } else {
      res.status(400).json({ message: "Failed to get LLaMA response." });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
