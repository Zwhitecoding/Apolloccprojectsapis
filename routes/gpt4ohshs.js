const axios = require('axios');

const conversations = {};

module.exports.routes = {
    name: "Gpt4o-pro",
    description: "Ask questions, analyze images, or generate images using Gpt-4o",
    usages: "/gpt4o-pro",
    query: "?q=hello&uid=123&imageUrl=",
    method: "get",
    category: "AI Tools",
};

module.exports.onAPI = async (req, res) => {
    const q = req.query.q;
    const uid = req.query.uid;
    const imageUrl = req.query.imageUrl;

    if (!q || !uid) {
        return res.status(400).json({
            author: "Kaizenji",
            error: "Please provide both 'q' and 'uid' parameters. ImageUrl is optional.",
            exampleUsage: "/gpt4o-pro?q=hello&uid=123&imageUrl="
        });
    }

    if (!conversations[uid]) conversations[uid] = [];
    conversations[uid].push({ role: "user", content: q });

    const content = imageUrl ? `${q} ${imageUrl}` : q;

    try {
        const response = await axios.post(
            'https://akihachiai-27409.chipp.ai/api/openai/chat',
            {
                messageList: [
                    {
                        type: 'TEXT',
                        content,
                        senderType: 'USER',
                        files: []
                    }
                ],
                fileIds: [],
                threadId: 'thread_f9bWrBZRsp5MfB8ceMb8Xp1g'
            },
            {
                headers: {
                    documentId: 'C1D3C0B6BF1C43BE36DEE554A2E272F8',
                    documentLifecycle: 'active',
                    frameType: 'outermost_frame',
                    initiator: 'https://akihachiai-27409.chipp.ai',
                    Accept: '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Content-Type': 'application/json',
                    Origin: 'https://akihachiai-27409.chipp.ai',
                    Referer: 'https://akihachiai-27409.chipp.ai/',
                    'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
                    'sec-ch-ua-mobile': '?1',
                    'sec-ch-ua-platform': '"Android"',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
                    Cookies: '__Host-next-auth.csrf-token=2f1110126b9f8a2ed65f8ab8a40705c4ecf625c3f7e64ec434470aa03020478e%7C449a2c299e849a1e0236ea482a8558acf1be479bc67cac4dc5f3c60f35fa6c2b; __Secure-next-auth.callback-url=https%3A%2F%2Fchipp-chat-x55q2h36pa-uc.a.run.app'
                }
            }
        );

        let reply = response.data.reply || response.data;
        reply = reply.replace("TOOL_CALL: analyzeImage\n\n", "");

        conversations[uid].push({ role: "assistant", content: reply });

        return res.json({ author: "Kaizenji", host: "CC PROJECTS APIS", response: reply });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ author: "Kaizenji", error: "Internal server error" });
    }
};
