const express = require("express");
const Gemini = require("btch-gemini");

module.exports.routes = {
    name: "Gemini Vision Image Pro",
    desc: "Generate responses using Gemini AI with vision capability",
    category: "AI Tools ",
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
        const imageResponse = await Gemini.gemini_image(prompt, url);
        res.send(imageResponse); // Returns only plain text

    } catch (error) {
        res.status(500).send("Gemini API error: " + error.message);
    }
};
