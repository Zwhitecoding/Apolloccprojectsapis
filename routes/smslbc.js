const express = require('express');
const axios = require('axios');
const router = express.Router();

const headers = {
  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Content-Type': 'application/json',
  'sec-ch-ua-platform': '"Android"',
  'lbcoakey': 'd1ca28c5933f41638f57cc81c0c24bca',
  'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  'sec-ch-ua-mobile': '?1',
  'origin': 'https://lbconline.lbcexpress.com',
  'sec-fetch-site': 'cross-site',
  'sec-fetch-mode': 'cors',
  'sec-fetch-dest': 'empty',
  'referer': 'https://lbconline.lbcexpress.com/',
  'accept-language': 'en-US,en;q=0.9',
  'priority': 'u=1, i',
};

async function getLbcToken() {
  const res = await axios.post(
    'https://lbcapigateway.lbcapps.com/lexaapi/lexav1/api/GenerateJWTToken',
    {
      Client: '2E1EEB',
      email: 'nigahhasimeha@gmail.com',
      password: 'v9xQeU2aQTI/xcqX/LcLdA==:9b6456604cf97ebb47ccb944f11649e4',
    },
    { headers }
  );
  return res.data;
}

async function getTexterToken(auth) {
  const config = {
    method: 'GET',
    url: 'https://lbcapigateway.lbcapps.com/promotextertoken/generate_client_token',
    headers: {
      ...headers,
      authorization: `Bearer ${auth}`,
      'ocp-apim-subscription-key': 'dbcd31c8bc4f471188f8b6d226bb9ff7',
    },
  };

  const res = await axios.request(config);
  return res.data;
}

async function sendSMS(message, recipient, token1, token2) {
  const data = JSON.stringify({
    Recipient: recipient,
    Message: `${message}\n\n-CC PROJECTS APIS\n\nNote: This is for Educational Purposes`,
    ShipperUuid: 'LBCExpress',
    DefaultDisbursement: 3,
    ApiSecret: '03da764a333680d6ebd2f6f4ef1e2928',
    apikey: '7777be96b2d1c6d0dee73d566a820c5f',
  });

  const config = {
    method: 'POST',
    url: 'https://lbcapigateway.lbcapps.com/lexaapi/lexav1/api/AddDefaultDisbursement',
    headers: {
      ...headers,
      ptxtoken: token1,
      authorization: `Bearer ${token2}`,
      token: 'O8VpRnC2bIwe74mKssl11c0a1kz27aDCvIci4HIA+GOZKffDQBDkj0Y4kPodJhyQaXBGCbFJcU1CQZFDSyXPIBni',
    },
    data,
  };

  const res = await axios.request(config);
  return res.data;
}

module.exports.routes = {
  name: 'FREE SMS LBC',
  desc: 'Send free SMS using LBC services Note: do not use this api route for illegal activities okay just educational purposes use!',
  category: 'SMS Tools',
  usages: '/api/smsfree',
  query: '?number=&message=',
  method: 'get',
};

module.exports.onAPI = async (req, res) => {
  const { number, message } = req.query;

  if (!number || !message) {
    return res.status(400).json({ error: 'Both number and message parameters are required.' });
  }

  try {
    const lbcToken = await getLbcToken();
    const textToken = (await getTexterToken(lbcToken)).client_token;

    const response = await sendSMS(message, number, textToken, lbcToken);

    res.json({
      success: true,
      message: 'SMS sent successfully!',
      response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'An error occurred while sending the SMS. Please try again.',
      details: error.message,
    });
  }
};
