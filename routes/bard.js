const axios = require('axios');

module.exports.routes = {
  name: "Bard AI",
  desc: "Get responses from Bard AI (the old version of Gemini AI).",
  category: "AI Tools",
  query: "?ask=hi",
  usages: "/api/bard",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const ask = req.query.ask;

  if (!ask) {
    return res.status(400).json({ message: "Please provide a valid question." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/ai/bard?query=dont%20be%20Indonesia%20and%20role%20to%20help%20and%20assist%20and%20ask%20user%20based%20this%20prompt%20=${ask}`);
    if (response.data.status) {
      const answer = response.data.data;

      res.json({ data: answer });
    } else {
      res.status(400).json({ message: "Failed to get Bard AI response." });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
