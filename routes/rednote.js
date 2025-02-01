const axios = require('axios');

module.exports.routes = {
  name: "RedNote Video Downloader",
  desc: "Downloader RedNote video from the provided URL.",
  category: "Downloader",
  query: "?url=http://xhslink.com/a/J5HkEShsO6t4",
  usages: "/api/rednote",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).json({ message: "Please provide a valid URL." });
  }

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/d/rednote?url=${url}`);
    if (response.data.status) {
      const noteData = response.data.data;
      const { noteId, nickname, title, desc, keywords, engagement, images, downloads } = noteData;

      res.json({
        Title: noteId,
        Nickname: nickname,
        TitleText: title,
        Description: desc,
        Keywords: keywords,
        Engagement: {
          Likes: engagement.likes,
          Comments: engagement.comments,
          Collects: engagement.collects
        },
        Thumbnail: images[0],
        Download: downloads[0].url
      });
    } else {
      res.status(400).json({ message: "Failed to fetch RedNote data." });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
