const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyBpB8_1oyp_zTO6NsbDjNpjMOoN7mm3CB4";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports.routes = {
  name: "Gemini AI Text Only",
  desc: "Generates text responses using the Gemini 1.5 AI model.",
  category: "AI Tools",
  usages: "/api/gen",
  query: "?ask=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  try {
    const { ask } = req.query;

    if (!ask) {
      return res.status(400).json({ error: 'Query parameter "ask" is required.' });
    }

    const result = await model.generateContent(ask);
    const response = await result.response;
    const text = await response.text();

    res.json({ result: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
