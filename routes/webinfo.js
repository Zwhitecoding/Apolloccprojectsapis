const express = require("express");
const { getLinkPreview } = require("link-preview-js");

module.exports.routes = {
    name: "Website Get Information",
    desc: "Get the Metadata from a given URL",
    category: "Tools",
    query: "?url=https://example.com",
    usages: "/api/webinfo",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).json({ error: "Missing required parameter: url" });

        const preview = await getLinkPreview(url, { followRedirects: "follow" });

        res.json(preview);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch link preview", details: error.message });
    }
};
