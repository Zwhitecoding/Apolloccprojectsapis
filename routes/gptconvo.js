const fs = require('fs');
const ai = require('unlimited-ai');

module.exports.routes = {
    name: "GPT Conversation",
    desc: "Handles Continuous GPT Conversations",
    usages: "/api/gptconvo",
    query: "?ask=hi&id=1",
    method: "get",
    category: "AI Tools",
};

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

module.exports.onAPI = async (req, res) => {
    const ask = req.query.ask;
    const id = req.query.id;

    if (!ask || !id) {
        return res.status(400).json({ error: 'Both "ask" and "id" parameters are required' });
    }

    const model = 'gpt-4-turbo-2024-04-09';

    try {
        let conversation = loadConversation(id);

        conversation.messages.push({ role: 'user', content: ask });

        const response = await ai.generate(model, conversation.messages);

        conversation.messages.push({ role: 'assistant', content: response });

        saveConversation(id, conversation);

        res.status(200).json(response);
    } catch (error) {
        console.error('Error handling GPT conversation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
