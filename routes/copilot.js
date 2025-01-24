const axios = require('axios');

module.exports.routes = {
    name: "Copilot AI",
    desc: "Interact with Copilot AI using conversational queries.",
    category: "AI Tools",
    query: "?ask=hello",
    usages: "/api/copilot",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const ask = req.query.ask;

    if (!ask) {
        return res.status(400).json({ status: false, error: '"ask" parameter is required.' });
    }

    let data = `{"content": "${ask}", "intent":"conversation", "references":[], "context":[],"currentURL":"https://github.com/copilot", "streaming":true, "confirmations":[],"customInstructions":[],"model":"gpt-4o","mode":"immersive","parentMessageID":"","tools":[]}`;

    let config = {
        method: 'POST',
        url: 'https://api.individual.githubcopilot.com/github/chat/threads/591959b4-dda9-4444-b0c6-6a0262f62849/messages',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'cache-control': 'max-age=0',
            'sec-ch-ua-platform': '"Android"',
            'authorization': 'GitHub-Bearer b91NN1dbKJB9H9pRwyObX-b7smMbkuT1KU_6uGHsuhmzqTtsysu8TumuLk7a2DWN5u1iG-RlnDJVKUT7VV5638FAiA2P-fJHDg_Ctm18_fU=',
            'copilot-integration-id': 'copilot-chat',
            'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            'sec-ch-ua-mobile': '?1',
            'dnt': '1',
            'content-type': 'text/event-stream',
            'origin': 'https://github.com',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://github.com/',
            'accept-language': 'en-US,en;q=0.9,id;q=0.8,fil;q=0.7',
            'priority': 'u=1, i'
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        const reply = response.data;

        const matches = reply.match(/"body":"(.*?)"/g);
        if (matches) {
            const arrangedReply = matches
                .map(match => match.replace(/"body":"(.*?)"/, '$1'))
                .join('')
                .replace(/\\n/g, '');

            res.json({ reply: arrangedReply });
        } else {
            res.status(400).json({ status: false, error: 'No reply found in the response.' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error occurred: ' + error.message });
    }
};
