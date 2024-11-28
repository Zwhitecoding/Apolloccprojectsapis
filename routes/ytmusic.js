const axios = require("axios");
const cheerio = require("cheerio");

module.exports.routes = {
  name: "YouTube Downloader MP3 V3",
  desc: "Download MP3 audio from YouTube links.",
  category: "Downloader",
  usages: "/api/ytmp3",
  query: "?yturl=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const { yturl } = req.query;

  if (!yturl) {
    return res.status(400).json({ error: "The 'yturl' parameter is required." });
  }

  try {
    const url = `https://freemp3downloads.online/en131/download?url=${encodeURIComponent(yturl)}`;
    const startTime = Date.now();

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const endTime = Date.now();
    const $ = cheerio.load(response.data);

    const card = $("div.card").filter((_, el) => {
      const header = $(el).find("div.card-header button.btn.btn-link").text();
      return header.includes("m4a 129kbps");
    });

    if (card.length > 0) {
      const link = card.find("a[href]").first().attr("href");
      const titleMatch = response.data.match(/title=([^"]+)/);
      const title = titleMatch ? decodeURIComponent(titleMatch[1]) : "Unknown Title";

      if (link) {
        return res.json({
          title: title.trim(),
          download_url: link,
          process_time: `${(endTime - startTime) / 1000} seconds`,
        });
      }
    }

    return res.status(404).json({ error: "No valid MP3 download link found." });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while processing the request.",
      details: error.message,
    });
  }
};
