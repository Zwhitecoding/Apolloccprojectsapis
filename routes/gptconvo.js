const express = require('express');
const fs = require('fs').promises;
const { gpt } = require("gpti");

const router = express.Router();

module.exports.routes = {
    name: "GPT Conversation",
    desc: "Handles Continuous GPT Conversations",
    usages: "/api/gptconvo",
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
    const filePath = `./${id}.json`;

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
        const response = await gpt.v1({
            messages,
            prompt: ask,
            model: "GPT-4",
            markdown: false
        });

        res.json({ response: response.gpt });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
