const axios = require('axios');

module.exports.routes = {
  name: "Recognition Music (Shazam)",
  desc: "Identify music from a given URL",
  category: "Tools",
  query: "?url=",
  usages: "/api/regco",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
    const url = req.originalUrl.split('/api/regco?url=')[1];
  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  try {
    const apiUrl = `http://sgp1.hmvhostings.com:25729/regco?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.status === "success" && response.data.result) {
      res.json(response.data);
    } else {
      res.status(404).json({ error: "Music not identified", message: "No result found for the provided URL." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Request failed", message: error.message });
  }
};
