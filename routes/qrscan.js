const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

module.exports.routes = {
  name: "QR Code Scanner",
  desc: "Scans QR codes from an image URL",
  category: "Tools",
  usages: "/api/scan-qr",
  query: "?url=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const fileUrl = req.query.url;

  if (!fileUrl) {
    return res.status(400).json({ error: 'URL for the QR code image is required.' });
  }

  try {
    const apiURL = `https://api.qrserver.com/v1/read-qr-code/?fileurl=${encodeURIComponent(fileUrl)}`;
    
    const response = await axios.get(apiURL);
    const data = response.data;

    if (data && data[0] && data[0].symbol && data[0].symbol[0]) {
      const qrData = data[0].symbol[0].data;

      if (qrData) {
        return res.status(200).json({
          success: true,
          message: "QR code scanned successfully.",
          qrData: qrData
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to extract data from the QR code.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unexpected response structure from the QR code API.",
      details: data
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
