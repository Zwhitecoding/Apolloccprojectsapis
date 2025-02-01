const axios = require('axios');
const FormData = require('form-data');

module.exports.routes = {
  name: "GPT-4o AI",
  desc: "Interact with GPT-4o AI via ChatGPTis.",
  category: "AI Tools",
  query: "?ask=hi&id=1",
  usages: "/api/gpt4o",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const ask = req.query.ask;
  const id = req.query.id;

  if (!ask || !id) {
    return res.status(400).json({ message: "Please provide both 'ask' and 'id' parameters." });
  }

  try {
    let data = new FormData();
    data.append('_wpnonce', '81ba7f1eed');
    data.append('post_id', '60');
    data.append('url', 'https://chatgptis.org');
    data.append('action', 'wpaicg_chat_shortcode_message');
    data.append('message', ask);
    data.append('bot_id', id);

    const response = await axios.post(
      'https://chatgptis.org/wp-admin/admin-ajax.php',
      data,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'sec-ch-ua-full-version-list': '"Chromium";v="130.0.6723.73", "Google Chrome";v="130.0.6723.73", "Not?A_Brand";v="99.0.0.0"',
          'sec-ch-ua-platform': '"Android"',
          'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
          'sec-ch-ua-bitness': '""',
          'sec-ch-ua-model': '"CPH1903"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-arch': '""',
          'sec-ch-ua-full-version': '"130.0.6723.73"',
          'dnt': '1',
          'content-type': `multipart/form-data; boundary=${data._boundary}`,
          'sec-ch-ua-platform-version': '"8.1.0"',
          'origin': 'https://chatgptis.org',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'referer': 'https://chatgptis.org/',
          'accept-language': 'en-US,en;q=0.9,id;q=0.8,fil;q=0.7',
          'priority': 'u=1, i',
          'Cookie': 'cf_clearance=05e4.fDnAJ1lqpGpSHd3u0xyoSlqvs9Pe4sW3zwhpqs-1738373286-1.2.1.1-w7ZZDWvXf0xqmbMr0Re7LlTpY4Jsjac3Ya5USWFFpOQYB9PSg_CSK9Adqz6HfceR2lDK8b1Ux.IOhXXiOEtZ6YVfjb4vt32DR3PQ6yHiRJjEyZC8N6yziapG_jKsnB_NS8SGeB4HmzW77O0ARXrdkiuR6ASeMyBGsTqUq6e96aIoihSHru.49Wu0o2xS4aPegG0Lp30cS2JxFTFugx0Bjy.B_CIHmzBO3zWlwGMONRBGfNxRdrG1DY2vYbSasEKNMHS3WkBalro3meXkyNfpM73kdQcBh1Cc_dWGYKiAT_u3VAKSMaVd8epYSaSXC91rcVtMa3sPzm5KPrXcREh3tw; _ga_KFLRM1ET6C=GS1.1.1738373318.1.0.1738373318.0.0.0; _ga=GA1.1.965557203.1738373319; wpaicg_chat_client_id=t_6339165bfa6987e04664f41c3df9bc; wpaicg_conversation_url_shortcode=c47ff410104f410b083b606300abbc14; c47ff410104f410b083b606300abbc14=a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22Human%3A%20Hi%0AAI%3A%20%22%3Bi%3A1%3Bs%3A34%3A%22Hello%21%20How%20can%20I%20assist%20you%20today%3F%22%3B%7D; __gads=ID=41c7ace2e9719fa6:T=1738373325:RT=1738373325:S=ALNI_Mb-tvh_tlfoK9XdblG88udfxrQGWQ; __gpi=UID=00001018a02d8830:T=1738373325:RT=1738373325:S=ALNI_MZY_DjvtJoDdHBCha9Xj58JSliJ7Q; __eoi=ID=7c1c612aead848a0:T=1738373325:RT=1738373325:S=AA-Afjbixf4T3Sr24J1IzzHKwle4'
        }
      }
    );

    res.json(response.data.data);

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
