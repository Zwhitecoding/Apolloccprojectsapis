const express = require("express");
const { tokencookie } = require("nayan-server");
const router = express.Router();

module.exports.routes = {
  name: "Token Getter Facebook Account",
  desc: "Generates a token for Facebook accounts using username and password",
  category: "Authentication Tools",
  usages: "/api/token",
  query: "?user=<username>&pass=<password>",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const { user, pass } = req.query;

  if (!user || !pass) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const data = await tokencookie(user, pass);
    const filteredData = {
      uid: data.uid,
      token: data.token,
      token6v7: data.token6v7,
    };

    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "Token generation failed.", details: error.message });
  }
};
