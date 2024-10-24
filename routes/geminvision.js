const axios = require('axios');

module.exports.routes = {
    name: "Gemini Vision",
    desc: "Analyze an image by providing its URL and a question. It returns a vision based on the image.",
    category: "AI Tools",
    usages: "/api/gemini",
    query: "?ask=hi&imgurl=https://files.catbox.moe/km22ta.jpg",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const ask = req.query.ask || req.body.ask;
    const photoUrl = req.query.imgurl || req.body.imgurl;

    if (!ask || !photoUrl) {
        return res.status(400).json({ error: 'Please provide both "ask" and "imgurl" parameters.' });
    }

    try {
        const response = await axios.get(`http://de01.uniplex.xyz:5611/gemini?ask=${encodeURIComponent(ask)}&imgurl=${encodeURIComponent(photoUrl)}`);
        const data = response.data;

        if (data && data.imageResponse) {
            return res.json({
                status: true,
                vision: data.imageResponse
            });
        } else {
            return res.status(500).json({
                status: false,
                error: 'Failed to retrieve image response from the Gemini API.'
            });
        }
    } catch (error) {
        return res.status(500).json({ status: false, error: 'An error occurred while processing your request.' });
    }
};
