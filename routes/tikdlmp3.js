const express = require("express");
const axios = require("axios");
const { URLSearchParams } = require("url");

module.exports.routes = {
    name: "TikTok MP3 Downloader",
    desc: "Download TikTok audio from video links",
    category: "Downloader",
    query: "?url=",
    usages: "/api/tikdlmp3",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).json({ error: "Missing required parameter: url" });

        let data = new URLSearchParams({
            id: url,
            locale: "eng",
            tt: "eDV2QTNm"
        });

        let config = {
            method: "POST",
            url: "https://ssstik.io/abc?url=dl",
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Origin": "https://ssstik.io",
                "Referer": "https://ssstik.io/download-tiktok-mp3"
            },
            data: data
        };

        let response = await axios.request(config);
        let html = response.data;

        let match = html.match(/href="(https:\/\/[^"]+tiktokcdn\.com[^"]+)"/);

        if (match && match[1]) {
            res.json(match[1]);
        } else {
            res.status(500).json({ error: "Download link not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching download link", details: error.message });
    }
};
