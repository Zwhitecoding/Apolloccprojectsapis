const axios = require('axios');

module.exports.routes = {
    name: "Shoti Random Videos",
    desc: "Random shoti video no need apikey",
    category: "Random Videos",
    usages: "/api/shoti",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const response = await axios.get('https://joncll.serv00.net/shotiapi.php');
        const data = response.data;

        if (data && data.code === 200 && data.message === 'success') {
            return res.json({
                status: true,
                region: data.data.region,
                video_url: data.data.url,
                cover: data.data.cover,
                title: data.data.title || "No title",
                duration: data.data.duration,
                user: {
                    username: data.data.user.username,
                    nickname: data.data.user.nickname,
                    userID: data.data.user.userID
                }
            });
        } else {
            return res.status(500).json({
                status: false,
                error: 'Failed to retrieve video details from the Shoti API.'
            });
        }
    } catch (error) {
        return res.status(500).json({ status: false, error: 'An error occurred while processing your request.' });
    }
};
