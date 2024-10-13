const { getJson } = require('serpapi');

module.exports.routes = {
    name: "Google Scholar Search",
    desc: "Search for articles on Google Scholar using a query.",
    category: "Educational",
    usages: "/api/gs",
    query: "?q=biology",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const query = req.query.q || 'biology';
        const apiKey = 'b2c5b4432c0a92a2084c551808540bb1998fd9e224a3629bc3c5943d0c0bf1c0';

        getJson({
            engine: 'google_scholar',
            q: query,
            api_key: apiKey,
        }, (json) => {
            const organicResults = json['organic_results'];
            res.json({ organicResults });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
