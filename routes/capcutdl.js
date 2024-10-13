const express = require('express');
const { capcut } = require('betabotz-tools');

module.exports.routes = {
    name: "CapCut Downloader",
    desc: "Download videos from CapCut",
    category: "Downloader",
    usages: "/api/capcut",
    query: "?url=",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const results = await capcut(url);
        res.json(results);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
