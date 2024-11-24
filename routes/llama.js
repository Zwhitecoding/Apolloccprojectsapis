const express = require('express');
const axios = require('axios');
const router = express.Router();

module.exports.routes = {
  name: 'LLAMA',
  desc: 'Chat With LLAMA And Provided question from LLAMA AI Model',
  category: 'AI Tools',
  usages: '/api/llama',
  query: '?question=hi',
  method: 'get',
};

module.exports.onAPI = async (req, res) => {
  const { question } = req.query;

  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  try {
    const response = await axios.get(`https://api.kenliejugarap.com/llama/?question=${question}`);
    const { response: llamaResponse } = response.data;

    if (!llamaResponse) {
      return res.status(404).json({ error: 'Unable to get a response from LLAMA API.' });
    }

    res.json({
      response: llamaResponse,
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while fetching response from LLAMA API.',
      details: error.message,
    });
  }
};
