const express = require('express');
const axios = require('axios');

module.exports.routes = {
    name: "YouTube Audio Downloader",
    desc: "Convert YouTube videos to audio",
    category: "Downloader",
    usages: "/api/yt/audio",
    query: "?url=",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).json({ error: 'No URL provided' });
    }

    const videoIdMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!videoIdMatch) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const videoId = videoIdMatch[1];

    try {
        const response = await axios.post('https://convert.tubidi.buzz/ajax.php', new URLSearchParams({
            videoid: videoId,
            downtype: 'mp3',
            vquality: '128'
        }).toString(), {
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'X-Requested-With': 'XMLHttpRequest',
                'Sec-CH-UA': '"Not-A.Brand";v="99", "Chromium";v="124"',
                'Sec-CH-UA-Mobile': '?1',
                'Sec-CH-UA-Platform': '"Android"',
                'Referer': `https://convert.tubidi.buzz/?videoId=${videoId}`
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error converting video', details: error.message });
    }
};
