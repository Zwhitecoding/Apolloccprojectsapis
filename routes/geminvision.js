const express = require("express");
const axios = require("axios");

module.exports.routes = {
    name: "Gemini Vision Image Pro",
    desc: "Generate responses using Gemini AI with vision capability",
    category: "AI Tools",
    usages: "/api/geminivision",
    method: "get",
    query: "?prompt=what is this&url=https://files.catbox.moe/wyh1er.jpg",
};

module.exports.onAPI = async (req, res) => {
    const { prompt, url } = req.query;

    if (!prompt || !url) {
        return res.status(400).send("Missing prompt or url parameter");
    }

    try {
        const apiUrl = `https://api.zetsu.xyz/gemini?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.gemini) {
            res.send(response.data.gemini);
        } else {
            res.status(500).send("Invalid API response format");
        }
    } catch (error) {
        res.status(500).send("Gemini API error: " + error.message);
    }
};
