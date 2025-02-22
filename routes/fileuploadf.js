const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

module.exports.routes = {
    name: "File CDN Uploadf",
    desc: "Upload files to Uploadf CDN and get the direct link",
    category: "File Upload",
    usages: "/api/upf",
    method: "get",
    query: "?url=",
};

module.exports.onAPI = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send("Missing 'url' parameter");
    }

    let fileName = "temp_upload_file";
    try {
        const parsedUrl = new URL(url);
        const urlPath = parsedUrl.pathname;
        const ext = path.extname(urlPath);
        const baseName = path.basename(urlPath, ext);

        fileName = baseName ? `${baseName}${ext}` : "temp_upload_file";

    } catch {
        return res.status(400).send("Invalid URL");
    }

    const tempFilePath = path.join(__dirname, fileName);

    const downloadFile = async (responseType) => {
        try {
            const response = await axios.get(url, { responseType });

            const writeStream = fs.createWriteStream(tempFilePath);
            response.data.pipe(writeStream);

            return new Promise((resolve, reject) => {
                writeStream.on("finish", resolve);
                writeStream.on("error", reject);
            });
        } catch {
            return false;
        }
    };

    const uploadFile = async () => {
        try {
            const formData = new FormData();
            formData.append("upfile", fs.createReadStream(tempFilePath));

            const response = await axios.post("https://uploadf.com/upload.php", formData, {
                headers: {
                    ...formData.getHeaders(),
                    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
                    "Accept": "application/json",
                },
            });

            const linkRegex = /https:\/\/uploadf\.com\/file\/[a-zA-Z0-9]+/;
            const match = response.data.match(linkRegex);

            return match ? match[0] : null;
        } catch {
            return null;
        }
    };

    try {
        let downloaded = await downloadFile("stream");

        if (!downloaded) {
            downloaded = await downloadFile("arraybuffer");
        }

        if (!downloaded) {
            return res.status(500).send("Failed to download the file");
        }

        const fileUrl = await uploadFile();

        fs.unlinkSync(tempFilePath);

        if (fileUrl) {
            res.send(fileUrl);
        } else {
            res.status(500).send("Failed to upload file to Uploadf");
        }
    } catch {
        res.status(500).send("Internal server error");
    }
};
