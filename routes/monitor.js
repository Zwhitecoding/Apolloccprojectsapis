const express = require('express');
const axios = require('axios');

module.exports.routes = {
  name: "Uptime And Monitor",
  desc: "Monitor the uptime of a website and check its status.",
  category: "Tools",
  usages: "/api/uptime",
  query: "?url=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const apiURL = `http://de01.uniplex.xyz:5611/uptime?url=${encodeURIComponent(url)}`;
    
    const response = await axios.get(apiURL);
    const data = response.data;

    if (data.message === "Website added successfully") {
      return res.status(200).json({
        success: true,
        message: "Website added to monitoring successfully.",
        monitoredUrl: data.url
      });
    }

    if (data.message === "URL is already in the list") {
      return res.status(200).json({
        success: false,
        message: "The URL is already being monitored.",
        monitoredUrl: data.url
      });
    }

    return res.status(500).json({
      error: "Unexpected response from the monitoring service.",
      details: data
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
