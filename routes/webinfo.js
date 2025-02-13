const express = require("express");
const { getLinkPreview } = require("link-preview-js");

module.exports.routes = {
    name: "Website get Information",
    desc: "Get all metadata and images from a given URL",
    category: "Utilities",
    query: "?url=https://example.com",
    usages: "/api/webinfo",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).json({ error: "Missing required parameter: url" });

        const preview = await getLinkPreview(url, {
            followRedirects: "follow",
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        res.json(preview);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch link preview", details: error.message });
    }
};
