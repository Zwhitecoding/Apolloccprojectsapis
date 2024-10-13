const CobaltAPI = require("cobalt-api");

module.exports.routes = {
    name: "YouTube Video Downloader",
    desc: "Download a video from YouTube by providing its URL.",
    category: "Downloader",
    usages: "/api/ytvideo",
    query: "?url=",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const youtubeUrl = req.query.url || req.body.url;

    if (!youtubeUrl) {
        return res.status(400).json({ error: 'Please provide a YouTube URL.' });
    }

    try {
        const cobalt = new CobaltAPI(youtubeUrl);

        const response = await cobalt.sendRequest();
        if (response.status) {
            return res.json({
                status: true,
                message: "Download successful",
                data: response.data
            });
        } else {
            return res.status(500).json({
                status: false,
                message: "Download failed",
                error: response.text
            });
        }
    } catch (error) {
        return res.status(500).json({ status: false, error: 'An error occurred while processing your request.' });
    }
};
