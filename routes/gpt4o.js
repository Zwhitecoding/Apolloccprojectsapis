const fs = require('fs');
const { gpt, nexra } = require("gpti");

nexra("user-6p293uo6a6", "nx-102A50682N108s32910q10U1e2mT5f74514l105xLUwds03cCXj2f6If");

const loadConversation = (id) => {
    const fileName = `${id}.json`;
    if (fs.existsSync(fileName)) {
        return JSON.parse(fs.readFileSync(fileName, 'utf8'));
    }
    return { id, messages: [] };
};

const saveConversation = (id, conversation) => {
    const fileName = `${id}.json`;
    fs.writeFileSync(fileName, JSON.stringify(conversation, null, 2), 'utf8');
};

module.exports.routes = {
    name: "Gpt4o V2",
    desc: "Handles Continuous GPT Conversations",
    usages: "/api/gpti",
    query: "?ask=&id=",
    method: "get",
    category: "AI Tools",
};

module.exports.onAPI = async (req, res) => {
    try {
        const ask = req.query.ask;
        const id = req.query.id;

        if (!ask || !id) {
            return res.status(400).json({ error: 'Both "ask" and "id" parameters are required' });
        }

        let conversation = loadConversation(id);

        conversation.messages.push({ role: "user", content: ask });

        const data = await gpt.v3({
            messages: conversation.messages,
            markdown: false,
            stream: false
        });

        if (data && data.message) {
            const responseContent = data.message;

            console.log("(GPT):", responseContent);

            conversation.messages.push({ role: "assistant", content: responseContent });

            saveConversation(id, conversation);

            res.json({
                author: "Hazeyy",
                gpt: responseContent
            });
        } else {
            console.error("Invalid response from GPT API:", data);
            res.status(500).send("Invalid response from GPT API");
        }
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).send("API Error");
    }
};
