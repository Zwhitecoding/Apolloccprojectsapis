const axios = require('axios');

module.exports.routes = {
  name: "SimSimi",
  desc: "Talk with simsimi ai is old version of own training ai by developer 2023 back then ",
  category: "Others",
  query: "?q=ask here",
  usages: "/api/simisimi",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).send({ message: 'Please provide a query parameter' });
  }

  try {
    const response = await axios.get(`https://joncll.serv00.net/sim/sim.php?query=${query}`);

    const { respond } = response.data;

    res.send({
      message: respond
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Error connecting to SimSimi AI' });
  }
};
