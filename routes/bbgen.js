const axios = require('axios');

module.exports.routes = {
  name: "Blackbox AI",
  desc: "Generates AI Images",
  category: "AI IMAGE GENERATOR",
  usages: "/api/blackbox/gen",
  query: "?prompt=hi",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const userPrompt = req.query.prompt;

  if (!userPrompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const url = 'https://www.blackbox.ai/api/chat';
  const requestData = {
    messages: [
      {
        id: "h0xRhYGa9Ie4uU97t47kl",
        content: userPrompt,
        role: "user"
      }
    ],
    id: "h0xRhYGa9Ie4uU97t47kl",
    previewToken: null,
    userId: null,
    codeModelMode: true,
    agentMode: {
      mode: true,
      id: "ImageGenerationLV45LJp",
      name: "Image Generation"
    },
    trendingAgentMode: {},
    isMicMode: false,
    maxTokens: 1024,
    playgroundTopP: null,
    playgroundTemperature: null,
    isChromeExt: false,
    githubToken: null,
    clickedAnswer2: false,
    clickedAnswer3: false,
    clickedForceWebSearch: false,
    visitFromDelta: false,
    mobileClient: false,
    userSelectedModel: null
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(url, requestData, { headers });
    if (response.data) {
      const cleanedResponse = response.data.replace(/\$@\$\w+=undefined-rv1\$@\$/g, '');
      return res.json({ response: cleanedResponse });
    } else {
      return res.status(500).json({ error: 'Unexpected response structure.' });
    }
  } catch (error) {
    console.error('Error while fetching Blackbox AI:', error.response ? error.response.data : error.message);
    return res.status(500).json({ error: 'Error while fetching Blackbox AI.' });
  }
};
