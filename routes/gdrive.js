const express = require('express');
const axios = require('axios');

module.exports.routes = {
    name: "Google Drive Uploader File",
    desc: "Google Drive Uploader Tools using file link",
    category: "Tools",
    usages: "/api/gdrive",
    query: "?url=",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const url = req.originalUrl.split('/api/gdrive?url=')[1];

    if (!url) {
        return res.status(400).json({ error: 'Please provide a url as a query parameter' });
    }

    try {
        const response = await axios.get(`http://de01.uniplex.xyz:5611/api/upload?url=${url}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};
