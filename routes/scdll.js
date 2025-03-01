const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { SoundCloud } = require("scdl-core");

module.exports.routes = {
    name: "SoundCloud Downloader",
    desc: "Download and convert SoundCloud tracks",
    category: "Downloader",
    usages: "/api/scdl",
    method: "get",
    query: "?url=",
};

module.exports.onAPI = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send("Missing 'url' parameter");
    }

    try {
        const metadataResponse = await axios.get(`https://jonellpogi.serv00.net/converturl.php?url=${encodeURIComponent(url)}`);
        const metadata = metadataResponse.data;

        if (!metadata.redirect_link || !metadata.title) {
            return res.status(400).send("Invalid SoundCloud URL or failed to fetch metadata");
        }

        await SoundCloud.connect();
        const stream = await SoundCloud.download(metadata.redirect_link, { highWaterMark: 1 << 25 });

        const timestamp = Date.now();
        const fileName = `${timestamp}.mp3`;
        const filePath = `./public/${fileName}`;

        const writeStream = fs.createWriteStream(filePath);
        stream.pipe(writeStream);

        writeStream.on("finish", () => {
            res.json({
                title: metadata.title,
                download: `${req.protocol}://${req.get("host")}/${fileName}`,
            });

            setTimeout(() => {
                fs.unlink(filePath, (err) => {
                    if (err) console.error("Failed to delete file:", err);
                });
            }, 5 * 60 * 1000);
        });

        writeStream.on("error", () => {
            res.status(500).send("Failed to save the file");
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to process SoundCloud URL", details: error.message });
    }
};
