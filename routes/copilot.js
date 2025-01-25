const axios = require('axios');

module.exports.routes = {
    name: "Copilot AI",
    desc: "Interact with Copilot AI using conversational queries.",
    category: "AI Tools",
    query: "?ask=hello",
    usages: "/api/copilot",
    method: "get",
};

let token = '';

async function fetchToken() {
    try {
        const config = {
            method: 'POST',
            url: 'https://github.com/github-copilot/chat/token',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'sec-ch-ua-platform': '"Android"',
                'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                'sec-ch-ua-mobile': '?1',
                'x-requested-with': 'XMLHttpRequest',
                'github-verified-fetch': 'true',
                'content-type': 'application/json',
                'dnt': '1',
                'origin': 'https://github.com',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'referer': 'https://github.com/copilot',
                'accept-language': 'en-US,en;q=0.9,id;q=0.8,fil;q=0.7',
                'priority': 'u=1, i',
                'Cookie': 'user_session=qqrlkAawDe1D7BRLdmWB4OugLYl09AK9Iaisoc3QDw8txJwo; __Host-user_session_same_site=qqrlkAawDe1D7BRLdmWB4OugLYl09AK9Iaisoc3QDw8txJwo; _octo=GH1.1.1147670827.1712475435; _device_id=c48ee78a6d691bd407a12a1fb41453ca; GHCC=Required:1-Analytics:1-SocialMedia:1-Advertising:1; logged_in=yes; dotcom_user=magallanes10; color_mode=%7B%22color_mode%22%3A%22auto%22%2C%22light_theme%22%3A%7B%22name%22%3A%22light%22%2C%22color_mode%22%3A%22light%22%7D%2C%22dark_theme%22%3A%7B%22name%22%3A%22dark%22%2C%22color_mode%22%3A%22dark%22%7D%7D; cpu_bucket=lg; preferred_color_mode=dark; tz=Asia%2FManila; _gh_sess=Lo%2FGmPISAYTBUI5OgmXEMDAFDf2U3oxmoCeSNLpHl21IJW0Szfyj%2BSRniEmswqdVa2VnuuOQi%2BbP2GGql4QGqP9OuUEKJTjldZLTjgqp5yiOqJ6MJs53f1Z6vo6YqTo7vS3Ttskhp9uOMhILp3iSTQUd1Qljw2F1zcoiSwfVs0E4SLXclgp7EKeYYhCEdZqxk0kqRwNLck9FF%2BT7cRhlPkie93KW75LLORCu1ThbdIfCcg%2BREuihm5Ll0ucMLpP5bFsUd9QdfGyahLjq%2BQOc%2FF%2BdnsME7C40%2FCoDmZKKdWIyn40hLSPjsbWNY2WcR%2F4BEmTpxg%3D%3D--fRrxU9NvKQH6Km%2FK--XklC%2B7%2FUQh5v70xGU7ABkw%3D%3D'
            },
        };

        const response = await axios.request(config);
        token = response.data.token;
    } catch (error) {
        throw new Error('Failed to fetch token: ' + error.message);
    }
}

module.exports.onAPI = async (req, res) => {
    const ask = req.query.ask;
    if (!ask) {
        return res.status(400).json({ status: false, error: '"ask" parameter is required.' });
    }

    try {
        if (!token) await fetchToken();

        const data = JSON.stringify({
            content: ask,
            intent: "conversation",
            references: [],
            context: [],
            currentURL: "https://github.com/copilot",
            streaming: true,
            confirmations: [],
            customInstructions: [],
            model: "gpt-4o",
            mode: "immersive",
            parentMessageID: "",
            tools: [],
        });

        const config = {
            method: 'POST',
            url: 'https://api.individual.githubcopilot.com/github/chat/threads/591959b4-dda9-4444-b0c6-6a0262f62849/messages',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'cache-control': 'max-age=0',
                'sec-ch-ua-platform': '"Android"',
                'authorization': `GitHub-Bearer ${token}`,
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
                'priority': 'u=1, i',
            },
            data: data,
        };

        const response = await axios.request(config);
        const matches = response.data.match(/"body":"(.*?)"/g);
        if (matches) {
            const arrangedReply = matches
                .map((match) => match.replace(/"body":"(.*?)"/, '$1'))
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
