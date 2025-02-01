const axios = require('axios');

module.exports.routes = {
  name: "Instagram Downloader",
  desc: "Instagram media download",
  category: "Downloader",
  query: "?url=",
  usages: "/api/insta",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).json({ message: "Please provide a valid URL." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/d/igdl?url=${url}`);
    if (response.data.status) {
      const mediaData = response.data.data[0];
      const { thumbnail, url: downloadLink } = mediaData;

      res.json({
        Thumbnail: thumbnail,
        DownloadLink: downloadLink
      });
    } else {
      res.status(400).json({ message: "Failed to fetch Instagram media data." });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
