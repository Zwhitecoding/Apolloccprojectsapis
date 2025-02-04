const fs = require('fs');
const path = require('path');
const { SoundCloud } = require('scdl-core');
const express = require('express');

const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

module.exports.routes = {
    name: "SoundCloud Downloader",
    desc: "Download SoundCloud tracks as MP3 files",
    category: "Downloader",
    query: "?url=https://m.soundcloud.com/zanie1/c2-na-red",
    usages: "/api/sc",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    let soundCloudUrl = req.query.url;
    if (!soundCloudUrl) return res.status(400).json({ error: 'SoundCloud URL is required.' });

    soundCloudUrl = soundCloudUrl.replace(/^https?:\/\/m\./, 'https://');

    try {
        const title = soundCloudUrl.split('/').pop().replace(/-/g, ' ');
        const timestamp = Date.now();
        const filePath = path.join(downloadsDir, `${timestamp}.mp3`);
        const fileStream = fs.createWriteStream(filePath);

        await SoundCloud.connect();
        const stream = await SoundCloud.download(soundCloudUrl, { highWaterMark: 1 << 25 });

        stream.pipe(fileStream);

        fileStream.on('finish', () => {
            const hostUrl = `${req.protocol}://${req.get('host')}`;
            const downloadLink = `${hostUrl}/downloads/${timestamp}.mp3`;

            res.json({ Title: title, dl: downloadLink });

            setTimeout(() => {
                fs.unlink(filePath, (err) => {
                    if (err) console.error(`Failed to delete ${filePath}:`, err);
                });
            }, 5 * 60 * 1000);
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to process SoundCloud track.' });
    }
};

module.exports.setup = (app) => {
    app.use('/downloads', express.static(downloadsDir));
};
