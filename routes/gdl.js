const express = require('express');
const { google } = require('googleapis');

const app = express();

const apiKey = 'AIzaSyCYUPzrExoT9f9TsNj7Jqks1ZDJqqthuiI';

if (!apiKey) {
  console.error('No Google Drive API key provided.');
  return;
}

const drive = google.drive({ version: 'v3', auth: apiKey });
const gdriveLinkPattern = /(?:https?:\/\/)?(?:drive.google.com\/(?:file\/d\/|open\?id=))([\w-]{33}|\w{19})(&usp=sharing)?/gi;

module.exports.routes = {
  name: "Google Drive Downloader",
  desc: "Google Drive file metadata and direct download URL",
  category: "Downloader",
  usages: "/api/gdl",
  query: "?url=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const googleDriveUrl = req.query.url;

  if (!googleDriveUrl) {
    return res.status(400).json({ error: 'Google Drive URL is required.' });
  }

  const match = gdriveLinkPattern.exec(googleDriveUrl);
  if (!match) {
    return res.status(400).json({ error: 'Invalid Google Drive URL.' });
  }

  const fileId = match[1];

  try {
    const fileMeta = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType, size, modifiedTime, createdTime'
    });

    const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    res.json({
      metadata: fileMeta.data,
      directDownloadUrl: directDownloadUrl,
      googleDriveLink: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`
    });

  } catch (err) {
    return res.status(500).json({ error: 'Error fetching file metadata.' });
  }
};
