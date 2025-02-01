const axios = require('axios');

module.exports.routes = {
  name: "YanzGPT API",
  desc: "Get responses from YanzGPT model.",
  category: "AI Tools",
  query: "?ask=hi",
  usages: "/api/yanzgpt",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const ask = req.query.ask;

  if (!ask) {
    return res.status(400).json({ message: "Please provide a valid question." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/ai/yanzgpt?query=${ask}&prompt=just%20ai%20to%20answer%20anything&modelType=yanzgpt-revolution-25b-v3.0`);
    
    if (response.data.status) {
      const context = response.data.data.choices[0].message.content;
      
      res.json({ context });
    } else {
      res.status(400).json({ message: "Failed to get YanzGPT response." });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
