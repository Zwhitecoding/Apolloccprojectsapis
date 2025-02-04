const axios = require('axios');

const auth = '_hjSessionUser_5183059=eyJpZCI6ImZiMDJmOWNhLTQwYzgtNWRiMC1iNzY2LTc5ZTkwZTM0NTI1ZiIsImNyZWF0ZWQiOjE3Mzg1NDY0NzQwMTYsImV4aXN0aW5nIjpmYWxzZX0=; _ga=GA1.1.808171181.1738546491; _tt_enable_cookie=1; _ttp=ZeKSpH34VSoA4SqUwETRu061_oG.tt.1; __hstc=54418935.97dad40a0e81fa52df59b43afeb4dc2f.1738546520047.1738546520047.1738546520047.1; hubspotutk=97dad40a0e81fa52df59b43afeb4dc2f; _ga_KMCTPBGXC3=GS1.1.1738546491.1.1.1738546667.0.0.0; GAESA=CowBMDBjYTM2OTVkMmE5OWQ2ZDllOTYwOGRhNGNhNWE1MWY1Yjg4YjY5OTNiMThlNWYyYWU0YzdlNDMzZWQyZjk2ZDgyNTc1YzJkMGYzZmMwNjYwNTE5YzAwZGJlMmVmM2MyNzYyZjBkNjQxOWJkZmFiNmNiMTMzNDU5YjUxMGJjNGViOGVmMGZmMGU3YTUQ3YCH9swy; __Host-next-auth.csrf-token=0ade671b5e7b1885d45f021509c3e819141a4c283e18f4f1174d3a2bd1a8a0f1%7C0587d69d91ad1175a560a01a49a03828987767b8449f8b2607d3819612f1c905; __Secure-next-auth.callback-url=https%3A%2F%2Fapp.chipp.ai; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..DIEAmFvwY94YUCJ2.ERzBwG909Np3I3Al8_yfzOmwFF6BfEs01Ow2Y_2JiNFao5jMHnxt7qtPBsKbWn3pWf_AXrnJbTltA7QQ2KEk9Ds0Inetrgm7EJJ55dhrZ6Kf-Vgi7VN0xT7ooMoyDFtGHeISIHx57ICcAeyQDOHbQRbQ7KLjioeStnEX8gxQKxZntFJWCWPHYFC5A8V0zb7Hw3KqaDgnt2mcmzYVHDop1h8yjTfNNAdPu2rtcMChcgns8qzNbTMoKp8zPsoWvHWzcoeS4TcYMaCrA5JuUhe9L6uePvdMs1PL2lg7g2yR7ZkJWdMHNGqU3uX379xeDA_TKlwzA_TpmMpsD1X0YCGtdHCSqHl82T4M_vS9_5CDNct-LlyD.vPdr2jWzeP6Yr5l9L2cZbQ; ph_phc_58R4nRj6BbHvFBIwUiMlHyD8X7B5xrup5HMX1EDFsFw_posthog=%7B%22distinct_id%22%3A%22georgebeard839%40gmail.com%22%2C%22%24sesid%22%3A%5B1738637205902%2C%220194cec1-cde5-7ea2-b83e-c1f028ca6223%22%2C1738635595237%5D%2C%22%24epp%22%3Atrue%7D';

module.exports.routes = {
    name: "Chipp AI",
    desc: "Ask question with Chip AI (Chat only)",
    category: "AI Tools",
    query: "?ask=",
    usages: "/api/chipaichat",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const ask = req.query;
        if (!ask) {
            return res.status(400).json({ error: "Missing required parameters: ask and imageUrl" });
        }

      //  const encodedImageUrl = encodeURIComponent(imageUrl);
        let data = JSON.stringify({
            "messages": [
                {
                    "role": "user",
                    "content": `${ask}`
                }
            ],
            "chatSessionId": "2d3a1beb-1ec9-45c7-8a28-236ba6eff6bb"
        });

        let config = {
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
                'Cookies': auth
            },
            data: data
        };

        const response = await axios.request(config);
        const responseText = response.data;
        const match = responseText.match(/"result":"(.*?)"/);

        if (match) {
            const resultText = match[1].replace(/\\"/g, '"');
            res.json({ result: resultText });
        } else {
            res.status(500).json({ error: "Result not found in response" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
