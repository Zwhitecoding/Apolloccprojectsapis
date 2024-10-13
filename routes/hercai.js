const axios = require('axios');

module.exports.routes = {
    name: "Hercai",
    desc: "Wrapper response from Hercai API",
    usages: "/api/hercai",
    method: "GET",
    query: "?question=hi",
    category: "AI Tools"
};

module.exports.onAPI = async function (req, res) {
    const { question } = req.query;

    if (!question) {
        return res.status(400).json({ error: "Question parameter is required" });
    }

    const response = await axios.get(`https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(question)}`);
    res.json(response.data);
};
