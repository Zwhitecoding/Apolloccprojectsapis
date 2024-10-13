const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');

module.exports.routes = {
    name: "Facebook UID Getter",
    desc: "Lookup Facebook User ID from URL Like Facebook Profile",
    category: "Tools",
    usages: "/api/fb",
    query: "?url=",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const fbUrl = req.query.url;
    const lookupUrl = "https://lookup-id.com";

    if (!fbUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const { data } = await axios.get(lookupUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const $ = cheerio.load(data);

        const formData = {
            fburl: fbUrl,
            check: 'Lookup'
        };

        const response = await axios.post(lookupUrl, qs.stringify(formData), {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const $response = cheerio.load(response.data);
        const codeElement = $response('#code-wrap #code');

        if (codeElement.length > 0) {
            const code = codeElement.text();
            const jsonResponse = { code };
            return res.json(jsonResponse);
        } else {
            return res.status(404).json({ error: 'Specified element not found.' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
