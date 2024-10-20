const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const router = express.Router();

const dataFilePath = path.join(__dirname, 'conversations.json');

module.exports.routes = {
  name: "GPT-4 Turbo",
  desc: "Chat-based using GPT-4 turbo",
  category: "AI Tools",
  usages: "/api/gpt4turbo",
  query: "?q=&id=",
  method: "get",
};

const read = () => {
  if (fs.existsSync(dataFilePath)) {
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  }
  return {};
};

const write = (conversations) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(conversations, null, 2), 'utf-8');
};

class NextwayProvider {
  async chatCompletion(messages, options, onData) {
    const proxyUrl = options.use_proxy
      ? "https://proxy.zachey.space/?url=https://chat.eqing.tech/api/openai/v1/chat/completions"
      : "https://origin.eqing.tech/api/openai/v1/chat/completions";

    const captchaToken = `P1_${[...Array(30)].map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(Math.floor(Math.random() * 64))).join("")}.${[...Array(256)].map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(Math.floor(Math.random() * 64))).join("")}.${[...Array(43)].map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(Math.floor(Math.random() * 64))).join("")}`;

    const body = JSON.stringify({
      messages,
      stream: options.stream,
      model: options.model || "gpt-4o-free",
      temperature: options.temperature || 0.5,
      max_tokens: options.maxTokens || 4000,
      captchaToken,
    });

    const headers = {
      ...this.baseHeaders("https://origin.eqing.tech/"),
      usesearch: [options.webSearch].toString(),
      "Content-Length": Buffer.byteLength(body),
    };

    const urlObj = new URL(proxyUrl);
    const requestOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers,
    };

    return new Promise((resolve, reject) => {
      const req = https.request(requestOptions, (res) => {
        let data = '';

        if (options.stream) {
          res.on('data', (chunk) => {
            data += chunk;
            if (onData) onData(chunk.toString());
          });
        } else {
          res.on('data', (chunk) => {
            data += chunk;
          });
        }

        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(new Error(`Request failed with status code ${res.statusCode}`));
          }

          if (options.stream) {
            return resolve();
          }

          try {
            const jsonData = JSON.parse(data);
            if (jsonData.choices && jsonData.choices.length > 0 && jsonData.choices[0].message && jsonData.choices[0].message.content) {
              resolve(jsonData.choices[0].message.content.trim());
            } else {
              reject(new Error("Invalid response format"));
            }
          } catch (e) {
            reject(new Error("Failed to parse JSON response: " + e.message));
          }
        });
      });

      req.on('error', (e) => {
        reject(new Error("Request error: " + e.message));
      });

      req.write(body);
      req.end();
    });
  }

  baseHeaders(url) {
    return {
      accept: "application/json, text/event-stream",
      "accept-language": "ru,en;q=0.9",
      "content-type": "application/json",
      priority: "u=1, i",
      "sec-ch-ua": '"Chromium";v="124", "YaBrowser";v="24.6", "Not-A.Brand";v="99", "Yowser";v="2.5"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      plugins: "0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      Referer: url,
      "Referrer-Policy": "strict-origin-when-cross-origin",
    };
  }
}

module.exports.onAPI = async (req, res) => {
  const { q, id } = req.query;

  if (!q || !id) {
    return res.status(400).json({ error: 'Missing query parameters: q or id.' });
  }

  let conversations = read();

  if (!conversations[id]) {
    conversations[id] = [{ role: 'system', content: 'You are a helpful assistant.' }];
  }

  conversations[id].push({ role: 'user', content: q });

  const provider = new NextwayProvider();

  try {
    const response = await provider.chatCompletion(conversations[id], { stream: false });
    conversations[id].push({ role: 'assistant', content: response });
    write(conversations);
    res.json({ status: true, owner: 'JrDev06 and CC PROJECTS APIS', response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
