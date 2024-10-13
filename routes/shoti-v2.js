const axios = require('axios');
const apikey = 'shoti-0c84a66d4efac6d30bd14600d604e134fa513aef0098f4b4403cd73e10cea235984c607ee279236eef4f7d3807eaa7a57259592f140bb92897a9e39432ba18d557ead768f67babc6d9c9152c9cd6b69ed12599b723';

module.exports.routes = {
    name: "Shoti V2 Random Bideo",
    desc: "Shoti v2 random shoti girl videos",
    category: "Random Videos",
    usages: "/api/shoti-v2",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const response = await axios.get(`https://shoti.kenliejugarap.com/getvideo.php?apikey=${apikey}`);

        if (response.data.status && response.data.response) {
            const videoDownloadLink = response.data.videoDownloadLink;
            const title = response.data.title;
            const tikUrl = response.data.tiktokUrl;

            return res.json({
                status: true,
                videoDownloadLink,
                title,
                tiktokUrl: tikUrl
            });
        } else {
            return res.status(500).json({
                status: false,
                error: 'Failed to retrieve video details from Shoti V2 API.'
            });
        }
    } catch (error) {
        return res.status(500).json({ status: false, error: 'An error occurred while processing your request.' });
    }
};
