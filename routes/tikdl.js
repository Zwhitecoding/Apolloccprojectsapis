const express = require('express');
const { tikdown } = require('nayan-media-downloader');

module.exports.routes = {
    name: "TikTok Download",
    desc: "Download TikTok videos using the video URL.",
    category: "Downloader",
    usages: "/api/tikdl",
    query: "?url=",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).send('Missing parameters. Please provide a "url" parameter.');
        }

        const result = await tikdown(url);
        res.json({ url: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
