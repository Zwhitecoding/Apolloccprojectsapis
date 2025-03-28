const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { CookieJar } = require("tough-cookie");

module.exports.routes = {
    name: "YouTube Audio Downloader",
    desc: "Downloads YouTube audio as MP3",
    category: "Downloader",
    usages: "/api/ytaudio",
    method: "get",
    query: "?url=",
};

const headers = {
    "User-Agent": "Mozilla/5.1",
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    Referer: "https://v4.mp3paw.link/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
};

const cookiesFile = "cookies.txt";
let cookieHeader = {};

if (fs.existsSync(cookiesFile)) {
    const cookieJar = new CookieJar();
    const cookies = fs.readFileSync(cookiesFile, "utf8").split("\n");

    cookies.forEach((line) => {
        if (!line.startsWith("#") && line.trim() !== "") {
            const parts = line.split("\t");
            if (parts.length >= 7) {
                const domain = parts[0];
                const name = parts[5];
                const value = parts[6];
                cookieJar.setCookieSync(`${name}=${value}; Domain=${domain}`, "https://youtube.com");
            }
        }
    });

    const cookieString = cookieJar.getCookieStringSync("https://youtube.com");
    if (cookieString) cookieHeader = { Cookie: cookieString };
}

module.exports.onAPI = async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ success: false, message: "Missing 'url' parameter" });

    try {
        const { data: html } = await axios.get(url, { headers: { ...headers, ...cookieHeader } });
        const $ = cheerio.load(html);

        const metadata = {
            title: $("meta[property='og:title']").attr("content") || "Unknown Title",
            thumbnail: $("meta[property='og:image']").attr("content") || "No Thumbnail",
        };

        const apiKey = "30de256ad09118bd6b60a13de631ae2cea6e5f9d";
        const downloadUrl = `https://p.oceansaver.in/ajax/download.php?copyright=0&format=mp3&url=${encodeURIComponent(url)}&api=${apiKey}`;
        const { data: downloadData } = await axios.get(downloadUrl, { headers });

        if (downloadData.success) {
            const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${downloadData.id}`;
            const { data: progressData } = await axios.get(progressUrl, { headers });

            return res.json({
                success: true,
                title: metadata.title,
                thumbnail: metadata.thumbnail,
                download_url: progressData.download_url || "Not Available",
                progress: progressData.progress || 0,
                author: "CC PROJECTS",
            });
        } else {
            return res.status(500).json({ success: false, message: "Download request failed", details: downloadData });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", details: error.message });
    }
};
