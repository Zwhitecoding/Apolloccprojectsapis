const express = require('express');
const fs = require('fs').promises;
const ai = require('unlimited-ai');

const router = express.Router();

module.exports.routes = {
    name: "GPT Conversation",
    desc: "Handles Continues GPT conversations",
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
    const model = 'gpt-4-turbo-2024-04-09';

    try {
        const data = await fs.readFile(`./${id}.json`, 'utf8');
        messages = JSON.parse(data);
    } catch (error) {
        messages = [
            { role: "system", content: "You're a math teacher." },
        ];
    }

    messages.push({ role: "user", content: ask });

    try {
        const response = await ai.generate(model, messages);
        messages.push({ role: "assistant", content: response });

        await fs.writeFile(`./${id}.json`, JSON.stringify(messages, null, 2));

        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
