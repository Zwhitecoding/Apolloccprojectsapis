const fs = require("fs");
const path = require("path");
const { gpt } = require("gpti");

const conversationsDir = "./conversations";
if (!fs.existsSync(conversationsDir)) {
    fs.mkdirSync(conversationsDir, { recursive: true });
}

module.exports.routes = {
    name: "GPT-4 Conversation",
    desc: "Engage in a conversation with GPT-4 while keeping chat history",
    category: "AI",
    query: "?ask=hi&id=1",
    usages: "/api/gpt4",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const query = req.query.ask;
        const id = req.query.id;

        if (!query || !id) {
            return res.status(400).json({ error: "Missing required parameters: ask or id" });
        }

        const filePath = path.join(conversationsDir, `${id}.json`);

        let conversation = [];
        if (fs.existsSync(filePath)) {
            try {
                conversation = JSON.parse(fs.readFileSync(filePath, "utf8"));
            } catch (error) {
                return res.status(500).json({ error: "Error reading conversation file" });
            }
        }

        conversation.push({ role: "user", content: query });

        let data = await gpt.v1({
            messages: conversation,
            model: "GPT-4",
            markdown: false
        });

        const responseText = data.gpt;
        conversation.push({ role: "assistant", content: responseText });

        fs.writeFileSync(filePath, JSON.stringify(conversation, null, 2));

        return res.json({ response: responseText });
    } catch (error) {
        return res.status(500).json({ error: "GPT API error", details: error.message });
    }
};
