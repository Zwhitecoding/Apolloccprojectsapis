const express = require("express");
const fs = require("fs");
const path = require("path");
const Gemini = require("btch-gemini");

module.exports.routes = {
    name: "Gemini Vision Pro",
    desc: "Generate responses using Gemini AI with vision capability conversation",
    category: "AI Tools",
    usages: "/api/geminivision",
    method: "get",
    query: "?prompt=hi&id=1&url=https://files.catbox.moe/wyh1er.jpg",
};

module.exports.onAPI = async (req, res) => {
    const { prompt, id, url } = req.query;

    if (!prompt || !id || !url) {
        return res.status(400).json({ error: "Missing prompt, id, or url parameter" });
    }

    const dirPath = path.join(__dirname, "gemini");
    const filePath = path.join(dirPath, `${id}.json`);

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    function loadConversation() {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, "utf8"));
        }
        return { history: [], imageResponse: null };
    }

    function saveConversation(data) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    }

    try {
        let conversationData = loadConversation();

        if (!conversationData.imageResponse) {
            conversationData.imageResponse = await Gemini.gemini_image(prompt, url);
        }

        conversationData.history.push({ role: "user", content: prompt });

        const historyResponse = await Gemini.gemini_history(conversationData.history);
        conversationData.history.push({ role: "assistant", content: historyResponse });

        saveConversation(conversationData);

        res.json(conversationData.imageResponse);

    } catch (error) {
        res.status(500).json({ error: "Gemini API error", details: error.message });
    }
};
