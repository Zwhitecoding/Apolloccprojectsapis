const axios = require('axios');
const fs = require('fs');
const path = require('path');

const Rona = 'https://api.deepinfra.com/v1/openai/chat/completions';
const MyRona = {
  'Accept': 'text/event-stream',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive',
  'Content-Type': 'application/json',
  'Host': 'api.deepinfra.com',
  'Origin': 'https://deepinfra.com',
  'Referer': 'https://deepinfra.com/',
  'Sec-CH-UA': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  'Sec-CH-UA-Mobile': '?0',
  'Sec-CH-UA-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'X-DeepInfra-Source': 'web-embed'
};

module.exports.routes = {
  name: "QwQ Assistant",
  desc: "Interact with a helpful assistant using conversational queries.",
  category: "AI Tools",
  query: "?ask=hello&id=1",
  usages: "/api/qwq",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const message = req.query.ask;
  const id = req.query.id;

  if (!message || !id) {
    return res.status(400).send({ Hazeyy: 'Please provide both message and id parameters' });
  }

  const data = {
    messages: [
      { role: "system", content: "Be a helpful assistant" },
      { role: "user", content: message }
    ],
    model: "Qwen/QwQ-32B-Preview",
    stream: false
  };

  try {
    const response = await axios.post(Rona, data, { headers: MyRona });
    const edit = response.data.choices[0].message.content;

    const filePath = path.join(__dirname, `${id}-cc.json`);

    let conversationHistory = [];
    if (fs.existsSync(filePath)) {
      conversationHistory = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    conversationHistory.push({ role: "user", content: message });
    conversationHistory.push({ role: "assistant", content: edit });

    fs.writeFileSync(filePath, JSON.stringify(conversationHistory, null, 2));

    res.send({
      author: 'Hazeyy and CC Project API',
      QwQ: edit
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
