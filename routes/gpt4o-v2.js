const axios = require('axios');

module.exports.routes = {
  name: "GPT4o v2",
  desc: "Interacts with GPT-4 based model.",
  category: "AI Tools",
  usages: "/api/gpt4o-v2",
  query: "?prompt=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const data = JSON.stringify({
    messageList: [
      {
        senderType: "BOT",
        content: "Hi there! How can I help you today?"
      },
      {
        type: "TEXT",
        content: prompt,
        senderType: "USER",
        files: []
      }
    ],
    fileIds: [],
    threadId: "thread_lGY4BEYXStiAR2jpPAnOq2kF"
  });

  const config = {
    method: 'POST',
    url: 'https://markbot-10923.chipp.ai/api/openai/chat',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Content-Type': 'application/json',
      'sec-ch-ua-platform': '"Android"',
      'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      'sec-ch-ua-mobile': '?1',
      'Origin': 'https://markbot-10923.chipp.ai',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'Referer': 'https://markbot-10923.chipp.ai/',
      'Accept-Language': 'en-US,en;q=0.9,fil;q=0.8'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    const message = response.data; 
    res.json({ response: message });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Main API' });
  }
};
