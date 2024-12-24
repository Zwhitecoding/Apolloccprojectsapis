const express = require('express');
const { ndown } = require('nayan-media-downloader');

module.exports.routes = {
    name: "Facebook Download",
    desc: "Download videos from Facebook using the video URL.",
    category: "Downloader",
    usages: "/api/fbdl",
    query: "?url=",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).send('Missing parameters. Please provide a "url" parameter.');
        }

        const result = await ndown(url);
        res.json({ url: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
