const express = require('express');
const axios = require('axios');

module.exports.routes = {
    name: "Random Riddle",
    desc: "random riddle and its answer.",
    category: "Others",
    usages: "/api/randomriddle",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const response = await axios.get('https://riddles-api.vercel.app/random');
        const data = response.data;

        res.json({
            riddle: data.riddle,
            answer: data.answer
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};
