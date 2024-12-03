const express = require('express');
const fs = require('fs').promises;
const { blackbox } = require("gpti");

const router = express.Router();

module.exports.routes = {
    name: "BlackBox AI Conversation",
    desc: "Handles BlackBox AI Conversations",
    usages: "/api/blackb",
    query: "?ask=hi&id=1",
    method: "get",
    category: "AI Tools",
};

module.exports.onAPI = async (req, res) => {
    const ask = req.query.ask;
    const id = req.query.id;

    if (!ask || !id) {
        return res.status(400).json({ error: 'Both "ask" and "id" parameters are required' });
    }

    let messages = [];
    const filePath = `./json/bb/${id}.json`;

    try {
        const data = await fs.readFile(filePath, 'utf8');
        messages = JSON.parse(data);
    } catch (error) {
        messages = [
            { role: "system", content: "You're a helpful assistant." }
        ];
    }

    messages.push({ role: "user", content: ask });

    try {
        const response = await blackbox({
            messages,
            markdown: false,
            stream: false
        });

        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
