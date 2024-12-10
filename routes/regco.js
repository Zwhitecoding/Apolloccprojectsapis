const axios = require("axios");

module.exports.routes = {
  name: "Recognize Music",
  desc: "Recognizes the track from a given file URL",
  category: "Tools",
  usages: "/api/recog",
  query: "?url=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const fileUrl = req.originalUrl.split('/api/recog?url=')[1];
;

  if (!fileUrl) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    const data = {
      url: fileUrl,
      api_token: "test",
      return: "apple_music,spotify",
    };

    const response = await axios.post("https://api.audd.io/", data);
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "An error occurred", details: err.message });
  }
};
    
