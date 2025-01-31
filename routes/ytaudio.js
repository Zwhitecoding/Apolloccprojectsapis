const axios = require('axios');

module.exports.routes = {
  name: "YouTube MP3 Downloader",
  desc: "Download audio (MP3) from YouTube videos.",
  category: "Downloader",
  query: "?url=https://youtube.com/video-url",
  usages: "/api/ytmp3",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send({ message: 'Please provide a URL parameter' });
  }

  try {
    const response = await axios.get(`https://ytdownloader.zetsu.xyz/ytdl?url=${url}&type=mp3`);

    const { download, title, response: timeResponse } = response.data;

    res.send({
      title: title,
      download_url: download,
      response_time: timeResponse
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Error fetching MP3 from YouTube' });
  }
};
