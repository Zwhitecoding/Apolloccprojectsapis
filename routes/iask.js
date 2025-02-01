const axios = require('axios');

module.exports.routes = {
  name: "iAsk AI",
  desc: "Get responses from iAsk AI.",
  category: "AI",
  query: "?ask=hi",
  usages: "/api/iask",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const ask = req.query.ask;

  if (!ask) {
    return res.status(400).json({ message: "Please provide a valid question." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/ai/iask?content=${ask}`);
    
    if (response.data.status) {
      const context = response.data.data;
      
      res.json({ context });
    } else {
      res.status(400).json({ message: "Failed to get iAsk AI response." });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
