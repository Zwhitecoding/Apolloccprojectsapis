const express = require("express");
const axios = require("axios");

const lastRequestTime = new Map();

module.exports.routes = {
    name: "Facebook Auto Create",
    desc: "Automatically create a Facebook account",
    category: "Authentication Tools",
    usages: "/api/fbcreate",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const userIP = req.ip;
        const now = Date.now();

        if (lastRequestTime.has(userIP) && now - lastRequestTime.get(userIP) < 10000) {
            return res.status(429).json({ error: "Too many requests. Please wait 10 seconds before trying again." });
        }

        lastRequestTime.set(userIP, now);

        let response = await axios.get("https://auto-create-fb-prank.onrender.com/create");
        let { status, ...filteredData } = response.data;

        res.json(filteredData);
    } catch (error) {
        res.status(500).json({ error: "Failed to create Facebook account", details: error.message });
    }
};
