const axios = require('axios');

module.exports.routes = {
    name: "Gemini AI",
    desc: "Interact with Gemini AI using a conversational approach.",
    category: "AI Tools",
    query: "?ask=hi&id=1",
    usages: "/api/gemini-ai",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const ask = req.query.ask;
    const id = req.query.id;

    if (!ask || !id || isNaN(id)) {
        return res.status(400).json({ status: false, error: 'Both "ask" and "id" parameters are required, and "id" must be a number' });
    }

    const numericId = Number(id);

    let data = JSON.stringify({
        botId: "chatbot-4yaap9",
        customId: null,
        session: "N/A",
        chatId: `${numericId}`,
        contextId: 12,
        messages: [
            {
                id: "2btso13fu2t",
                role: "assistant",
                content: "Hi! How can I help you?",
                who: "AI: ",
                timestamp: 1737686010835
            },
            {
                id: "1odt0aydbfj",
                role: "user",
                content: "what is solar system",
                who: "User: ",
                timestamp: 1737686036391
            }
        ],
        newMessage: ask,
        newFileId: null,
        stream: true
    });

    let config = {
        method: 'POST',
        url: 'https://www.pinoygpt.com/wp-json/mwai-ui/v1/chats/submit',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
            'Accept': 'text/event-stream',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Content-Type': 'application/json',
            'sec-ch-ua-platform': '"Android"',
            'sec-ch-ua': '"Chromium";v="130", "Google Chrome"',
            'sec-ch-ua-mobile': '?1',
            'x-wp-nonce': '179bd6486f',
            'dnt': '1',
            'origin': 'https://www.pinoygpt.com',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://www.pinoygpt.com/',
            'accept-language': 'en-US,en;q=0.9,id;q=0.8,fil;q=0.7',
            'priority': 'u=1, i',
            'Cookie': 'mwai_session_id=6792fbf4651be; _ga_RKSNK15R27=GS1.1.1737686011.1.0.1737686011.0.0.0; _ga=GA1.1.2033035087.1737686012; PHPSESSID=60a2dac7747747656b77294fced96177; __gads=ID=6329a1e308b88527:T=1737686015:RT=1737686015:S=ALNI_MYe9vN4b1_fzQmSKlW2pH7l4z357A; __gpi=UID=0000100960c7f576:T=1737686015:RT=1737686015:S=ALNI_MaXebOBWOiPkdbO-VyVuZp_8eiKQw; __eoi=ID=3546900993a9de7a:T=1737686015:RT=1737686015:S=AA-Afjazp4THCbgNYYdagZRVxYWB; FCNEC=%5B%5B%22AKsRol_O8t3J8O3MvTmoWxI1oOgx1RIYKvxSEutDXnxxkSIAagTYjznOjDrGH85SlsBUFgefBLwZle75LLDercyPw1_scJx2IFlVKkTvLsKvAdJYCtLAFhYrLfKec0R2Rw4MTYF4w60H_tJmpNwK--1ndYtK8_gymQ%3D%3D%22%5D%5D'
        },
        data: data
    };

    try {
        const response = await axios.request(config);

        const rawData = response.data;
        const regex = /"reply\\\":\\\"(.*?)\\\"/;
        const match = regex.exec(rawData);

        if (match && match[1]) {
            const reply = match[1]
                .replace(/\\\\u[\dA-F]{4}/gi, (unicode) =>
                    String.fromCharCode(parseInt(unicode.replace(/\\\\u/g, ''), 16))
                )
                .replace(/\\\\n/g, '\n')
                .replace(/\\\\/g, '')
                .replace(/\\"/g, '"');

            res.json({ reply: reply });
        } else {
            res.status(400).json({ status: false, error: 'No reply found in the response.' });
        }
    } catch (error) {
        res.status(500).json({ status: false, error: 'Error occurred: ' + error.message });
    }
};
