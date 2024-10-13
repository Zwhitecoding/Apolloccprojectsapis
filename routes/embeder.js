const express = require('express');
const fs = require('fs');
const path = require('path');

module.exports.routes = {
  name: "Embeder",
  desc: "Generates an embedded HTML page from a given URL and name.",
  category: "Tools",
  usages: "/api/embed",
  query: "?url=&name=",
  method: "get",
};

module.exports.onAPI = (req, res) => {
  const { url, name } = req.query;

  if (!url || !name) {
    return res.status(400).json({ error: 'URL and name are required' });
  }

  const embedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            font-family: Arial, sans-serif;
        }
        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
        }
        .logo {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background-color: #ffffff;
            border-radius: 12px;
            padding: 5px 15px;
            display: flex;
            align-items: center;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }
        .logo img {
            height: 24px;
            margin-right: 10px;
        }
        .logo span {
            font-size: 14px;
            color: #333333;
        }
    </style>
</head>
<body>
    <iframe src="${url}" title="${name}"></iframe>

    <div class="logo">
        <img src="https://www.cjoint.com/data/NHsxRKm284Q_embed-2.png" alt="Powered by CC Embed">
        <span>Powered by CC Embed</span>
    </div>
</body>
</html>`;
  
  const encodedHtml = Buffer.from(embedHtml).toString('base64');
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
</head>
<body>
    <script>
        document.write(atob('${encodedHtml}'));
    </script>
</body>
</html>`;

  const fileName = `${name.toLowerCase().replace(/\s+/g, '-')}.html`;
  const filePath = path.join(__dirname, 'public', 'cc', fileName);

  fs.mkdirSync(path.join(__dirname, 'public', 'cc'), { recursive: true });

  fs.writeFile(filePath, htmlContent, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to generate embed file.' });
    }

    const host = req.get('host');
    return res.json({ success: true, filePath: `https://${host}/cc/${fileName}` });
  });
};
