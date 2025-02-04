const axios = require('axios');

module.exports.routes = {
    name: "Chipp AI Text Chat",
    desc: "Chat with AI using text model only",
    category: "AI Tools",
    query: "?ask=Hi",
    usages: "/api/chaitext",
    method: "post",
};

module.exports.onAPI = async (req, res) => {
    try {
        const { ask } = req.query;
        if (!ask) {
            return res.status(400).json({ error: "Missing required parameter: ask" });
        }

        const data = JSON.stringify({
            "messages": [
                {
                    "role": "user",
                    "content": ask
                }
            ],
            "chatSessionId": "ee139603-9f22-4257-a9df-adb57613e0ca"
        });

        const config = {
            method: 'POST',
            url: 'https://app.chipp.ai/api/chat',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Content-Type': 'application/json',
                'sec-ch-ua-platform': '"Android"',
                'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                'dnt': '1',
                'sec-ch-ua-mobile': '?1',
                'origin': 'https://app.chipp.ai',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'referer': 'https://app.chipp.ai/applications/38794/build',
                'accept-language': 'en-US,en;q=0.9,id;q=0.8,fil;q=0.7',
                'priority': 'u=1, i',
                'Cookies': req.headers.cookies
            },
            data: data
        };

        const response = await axios.request(config);
        let rawText = response.data;

        let cleanedText = rawText
            .split('\n')
            .filter(line => line.startsWith('0:'))
            .map(line => line.replace(/^0:"|"/g, '').trim())
            .join(' ')
            .replace(/\s+/g, ' ');

        res.json(cleanedText);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Request failed' });
    }
};
