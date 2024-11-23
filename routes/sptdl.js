const express = require('express');
const axios = require('axios');
const router = express.Router();

module.exports.routes = {
  name: "Spotify Downloader",
  desc: "To download Spotify tracks and metadata",
  category: "Downloader",
  usages: "/api/spotifydl",
  query: "?url=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'No Spotify URL provided. Please add ?url=SPOTIFY_URL to the request.' });
  }

  try {
    const metadataResponse = await axios.post(
      'https://spotydown.media/api/get-metadata',
      { url },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const downloadResponse = await axios.post(
      'https://spotydown.media/api/download-track',
      { url },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const trackData = metadataResponse.data.apiResponse.data[0];

    res.json({
      metadata: {
        album: trackData.album,
        album_artist: trackData.album_artist,
        artist: trackData.artist,
        track_name: trackData.name,
        isrc: trackData.isrc,
        release_date: trackData.releaseDate,
        spotify_url: trackData.url,
        cover_image: trackData.cover_url,
      },
      download: {
        file_url: downloadResponse.data.file_url,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the Spotify URL. Please try again later.' });
  }
};
