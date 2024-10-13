const { openai } = require('betabotz-tools');

module.exports.routes = {
    name: "ChatGPT",
    desc: "Interact with OpenAI's GPT using input from query",
    category: "AI Tools",
    usages: "/api/chatgpt",
    query: "?input=Hello",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const input = req.query.input;

    if (!input) {
        return res.status(400).json({ error: 'Input parameter is required' });
    }

    try {
        const results = await openai(input);

        const modifiedResults = { ...results, creator: 'Jonell Magallanes' };

        res.json(modifiedResults);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
