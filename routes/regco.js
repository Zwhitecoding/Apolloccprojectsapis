const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const downloadFile = async (url, filePath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(filePath));
        });
      } else {
        reject(new Error(`Failed to download file: ${response.statusCode}`));
      }
    });

    request.on('error', (err) => {
      reject(err);
    });
  });
};

const uploadToAudd = async (filePath) => {
  const data = new FormData();
  data.append('file', fs.createReadStream(filePath));

  const config = {
    method: 'POST',
    url: 'https://api.audd.io?api_token=test&return=apple_music%2Cspotify',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'sec-ch-ua-platform': '"Android"',
      'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryCArLbaFnfH7xDxoL',
      'dnt': '1',
      'sec-ch-ua-mobile': '?1',
      'origin': 'https://audd.io',
      'sec-fetch-site': 'same-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://audd.io/',
      'accept-language': 'en-US,en;q=0.9,id;q=0.8,fil;q=0.7',
      'priority': 'u=1, i'
    },
    data: data
  };

  return axios.request(config);
};

module.exports.routes = {
  name: "Recognition Music Shazam",
  desc: "Download and identify music from a given URL",
  category: "Tools",
  query: "?url=",
  usages: "/api/regco",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const url = req.originalUrl.split('/api/regco?url=')[1];
  
  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  try {
    const filePath = path.join(__dirname, 'tempfile.mp3');
    let downloadError = null;

    try {
      await downloadFile(url, filePath);
    } catch (error) {
      downloadError = error.message;
    }

    if (downloadError) {
      const arrayBufferResponse = await axios.get(url, { responseType: 'arraybuffer' });
      fs.writeFileSync(filePath, arrayBufferResponse.data);
    }

    const auddResponse = await uploadToAudd(filePath);

    const filteredResponse = {
      status: auddResponse.data.status,
      result: {
        artist: auddResponse.data.result.artist,
        title: auddResponse.data.result.title,
        album: auddResponse.data.result.album,
        release_date: auddResponse.data.result.release_date,
        label: auddResponse.data.result.label,
        timecode: auddResponse.data.result.timecode,
        song_link: auddResponse.data.result.song_link,
        apple_music: auddResponse.data.result.apple_music,
        spotify: auddResponse.data.result.spotify
      }
    };

    fs.unlinkSync(filePath);

    res.json(filteredResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Request failed', message: error.message });
  }
};
