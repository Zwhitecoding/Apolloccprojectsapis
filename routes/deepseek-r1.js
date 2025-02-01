const axios = require('axios');

module.exports.routes = {
  name: "DeepSeek R1 Model",
  desc: "Get responses from DeepSeek-R1 AI.",
  category: "AI Tools",
  query: "?ask=your-question",
  usages: "/api/deepseek-r1",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const ask = req.query.ask;

  if (!ask) {
    return res.status(400).json({ message: "Please provide a valid question." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/ai/deepseek-r1?content=${ask}`);
    
    if (response.data.status) {
      const context = response.data.data.replace("</think>\n\n", "");

      res.json(context);
    } else {
      res.status(400).json({ message: "Failed to get DeepSeek R1 response." });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
