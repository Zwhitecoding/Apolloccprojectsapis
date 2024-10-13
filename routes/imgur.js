const axios = require('axios');
const fs = require('fs');
const path = require('path');
const isUrl = require('is-url');

const isValidUrl = (string) => {
  try {
    return isUrl(string);
  } catch (err) {
    return false;
  }
};

module.exports.routes = {
  name: "Imgur Uploader",
  desc: "Uploads an image to Imgur using a path or URL.",
  category: "Tools",
  usages: "/api/upload",
  query: "?image=",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const { image } = req.query;

  if (!image) {
    return res.status(400).json({ error: 'Please provide an image path or URL as a query parameter.' });
  }

  const clientId = 'e4f58fc81daec99';
  const url = 'https://api.imgur.com/3/image';

  try {
    let imageData;

    if (isValidUrl(image)) {
      const imageResponse = await axios.get(image, { responseType: 'arraybuffer' });
      imageData = Buffer.from(imageResponse.data).toString('base64');
    } else {
      const fullPath = path.resolve(image);
      imageData = fs.readFileSync(fullPath, { encoding: 'base64' });
    }

    const headers = {
      'Authorization': `Client-ID ${clientId}`,
    };

    const response = await axios.post(
      url,
      { image: imageData },
      { headers }
    );

    if (response.data && response.data.success) {
      res.json({ success: true, link: response.data.data.link });
    } else {
      res.status(500).json({ error: 'Image upload failed', details: response.data });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred', details: error.response ? error.response.data : error.message });
  }
};
