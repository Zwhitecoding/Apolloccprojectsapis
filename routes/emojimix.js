const axios = require('axios');

module.exports.routes = {
  name: "Emoji Mix",
  desc: "Mixes two emojis and returns the result.",
  category: "Others",
  usages: "/api/emojimix",
  query: "?one=&two=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const x = req.query.one;
  const y = req.query.two;

  if (!x || !y) {
    return res.status(400).json({ error: 'Missing query parameters' });
  }

  const url = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYQ_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${x}_${y}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.error) {
      res.status(response.status).json(data);
    } else if (data.locale === '') {
      res.status(404).json(data);
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};
