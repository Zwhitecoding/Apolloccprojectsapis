const express = require("express");
const fs = require("fs");
const path = require("path");
const cloudscraper = require("cloudscraper");

const SPOTIFY_API = "https://ccprojectapis.ddns.net/api/spotifydl?url=";
const DOWNLOADS_DIR = "./public";

if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

module.exports.routes = {
    name: "Spotify Downloader v2",
    desc: "Download Spotify tracks V2",
    category: "Downloader",
    query: "?url=",
    usages: "/api/sptdlv2",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const trackUrl = req.query.url;
        if (!trackUrl) {
            return res.status(400).json({ error: "Missing required parameter: url" });
        }

        const response = await cloudscraper.get(SPOTIFY_API + encodeURIComponent(trackUrl));
        const data = JSON.parse(response);

        if (!data.download || !data.download.file_url) {
            return res.status(500).json({ error: "Download URL not found in response." });
        }

        const fileUrl = data.download.file_url;
        const timestamp = Date.now();
        const filePath = path.join(DOWNLOADS_DIR, `${timestamp}.mp3`);
        const host = req.hostname;

        const fileStream = fs.createWriteStream(filePath);
        const downloadStream = cloudscraper.get({ uri: fileUrl, encoding: null });

        downloadStream.pipe(fileStream);

        downloadStream.on("end", () => {
            setTimeout(() => {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }, 5 * 60 * 1000);
        });

        downloadStream.on("error", (err) => {
            return res.status(500).json({ error: "Download failed", details: err.message });
        });

        return res.json({
            metadata: {
                album: data.metadata.album,
                album_artist: data.metadata.album_artist,
                artist: data.metadata.artist,
                track_name: data.metadata.track_name,
                isrc: data.metadata.isrc,
                release_date: data.metadata.release_date,
                spotify_url: data.metadata.spotify_url,
                cover_image: data.metadata.cover_image,
            },
            download: {
                file_url: `https://${host}/${timestamp}.mp3`,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: "Request failed", details: error.message });
    }
};
