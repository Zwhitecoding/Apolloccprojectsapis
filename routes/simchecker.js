const express = require('express');
const axios = require('axios');
const router = express.Router();

module.exports.routes = {
  name: 'Check Sim Brand',
  desc: 'Identify the mobile number brand and details',
  category: 'SIM Tools',
  usages: '/api/simbrand',
  query: '?number=',
  method: 'get',
};

module.exports.onAPI = async (req, res) => {
  const { number } = req.query;

  if (!number) {
    return res.status(400).json({ error: 'Mobile number is required.' });
  }

  try {
    const response = await axios.get(`https://api.kenliejugarap.com/ph-numbrandchecker/?number=${number}`);
    const { status, response: simData } = response.data;

    if (!status || !simData) {
      return res.status(404).json({ error: 'Unable to fetch SIM brand details.' });
    }

    res.json({
      success: true,
      number_prefix: simData.number_prefix,
      brand_code: simData.brand_code,
      brand_name: simData.brand_name,
      brand_description: simData.brand_description,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching SIM brand details.',
      details: error.message,
    });
  }
};
