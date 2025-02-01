const axios = require('axios');

module.exports.routes = {
  name: "Facebook Video Downloader",
  desc: "Download Facebook videos in MP4 Download Link generate",
  category: "Downloader",
  query: "?url=",
  usages: "/api/fbdl",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).json({ message: "Please provide a valid URL." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/d/savefrom?url=${url}`);
    if (response.data.status) {
      const videoData = response.data.data[0];
      const title = videoData.meta.title;
      const downloadUrl = videoData.url[0].url;
      
      res.json({
        Title: title,
        dl: downloadUrl
      });
    } else {
      res.status(400).json({ message: "Failed to fetch video data." });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
