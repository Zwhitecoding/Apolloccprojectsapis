const axios = require('axios');

module.exports.routes = {
    name: "DeepSeek AI",
    desc: "Interact with DeepSeek AI lastest model qwen-plus-latest and conversational question ",
    category: "AI Tools",
    query: "?ask=hi&id=1",
    usages: "/api/deepseek",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const { ask, id } = req.query;

    if (!ask || !id) {
        return res.status(400).json({ error: "Missing 'ask' or 'id' parameter" });
    }

    const data = JSON.stringify({
        stream: true,
        chat_type: "t2t",
        model: "qwen-plus-latest",
        messages: [
            {
                role: "user",
                content: ask,
                extra: {}
            }
        ],
        session_id: "11833c01-d760-4e8c-b490-637941fa94b5",
        chat_id: id,
        id: "e11398f9-5c53-48b3-a778-1919db19dff4"
    });

    const config = {
        method: 'POST',
        url: 'https://chat.qwenlm.ai/api/chat/completions',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Content-Type': 'application/json',
            'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMxZmVhMTI1LTY5YWUtNDBjMi1hODAzLTY1ODRlMTY1ZTk4MSIsImV4cCI6MTc0MDcwNTY3NH0.XH6aP5pJncticMxQNftoGH-bGiEY9WZIY9P29-uPEvY',
            'sec-ch-ua-platform': '"Android"',
            'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            'sec-ch-ua-mobile': '?1',
            'dnt': '1',
            'bx-v': '2.5.0',
            'origin': 'https://chat.qwenlm.ai',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://chat.qwenlm.ai/c/63cc6649-20b9-4c6c-9f8d-b4fd9364fa3b',
            'accept-language': 'en-US,en;q=0.9,id;q=0.8,fil;q=0.7',
            'priority': 'u=1, i',
           'Cookie': 'acw_tc=a3f69e3bf91eecba721a6810d9afc781b23fbf92aa4b491231a4863bfb621d0a; x-ap=cn-hongkong; _gcl_aw=GCL.1738113586.CjwKCAiAneK8BhAVEiwAoy2HYY3USVcb7Knx0jUX_WyYDnTHnNH9j25ppVj0G_VOKTxL3z0WN1sVRxoC3q4QAvD_BwE; _gcl_gs=2.1.k1$i1738113584$u144090599; cna=NXAgIKmZihYCAYPib79eBnHv; xlly_s=1; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMxZmVhMTI1LTY5YWUtNDBjMi1hODAzLTY1ODRlMTY1ZTk4MSIsImV4cCI6MTc0MDcwNTY3NH0.XH6aP5pJncticMxQNftoGH-bGiEY9WZIY9P29-uPEvY; _gcl_au=1.1.243457263.1738113586.581348789.1738113667.1738113674; SERVERID=7b36c1ef436a668c47bbc1b9b6cbe41b|1738113967|1738113585; SERVERCORSID=7b36c1ef436a668c47bbc1b9b6cbe41b|1738113967|1738113585; ssxmod_itna=Yqfx0D2QqCqQqY5DtG0iiD=WGOWQmAq0dGMD3qiQGgDYq7=GFKDCh9haegr4x2x0IsKmGhit47RxGNeK=x0=7Df40W+Ghr+hCV77GiNYQkDxhYGKWRiAbn3VgY6l9jHXP2NrD74i8NxW5DBxDYWDGCDnKD92wYbY4Dx2+hix0kq4D3DiPD=xi3qz0N3xiWVrxDjx07a+Y++QDK3PLYk=0wR1eeQQDeKBGN0b0DVjLqrQit+7mOk2ojocqjkhxz+D0raFoDvhfoq4ibNESQtIwqfEnCkgDX4r0Nb0DedultZGhxscnweDxeVDql87dTDD; ssxmod_itna2=Yqfx0D2QqCqQqY5DtG0iiD=WGOWQmAq0dGMD3qiQGgDYq7=GFKDCh9haegr4x2x0IsKmGhit47exAorT7Gieq4DFOGe5T1+DDsFv+aBF1T=QpGq27I+BdK2V/8/yFoLV+KbC4i9R7fSsBwfx/+G6Rqiq94UeHQUsBRLS/x6qIRN3PuXR4qxBGh=YyRxfGr=Yi0iOe8377ZvKKBijlgboKpi0BLDuUn6xDkfDy+DfGTvko6fSBx3Q07DA7kDqGMQ9m00RCY8uU7=o77t9BI=4/F+g3kGoQwMczb9EkVQ4X8Lc2AjqfqY4mirTTsIOYOrrLw1zLQH2iTdhvLQA4ssEke0dFe4Rw+ITbVieKD7mbzTDs3AhEqseiCi7CIesbexbBFoipK0D=exKGxEQw+xpaM5UoICxm9nvR3xr0vfdavnY4gwr67g75ZisyQabYfKY5iGfsWDD; isg=BGho_xidm5LdMLcWULGPdAGGOVR6kcybOGstzyKZmOPFfSrn1KDdKe77cBuN7oRz; tfstk=g0Kj5C9NHFiuYoNknjHPOgEBvMS_BCiUHR69KdE4BiIA1ROwpNB40xYsCQ5rnKSxiQaRBCx4WOCt2361BA2vH1C_yCC7HFrts3_1KB-aHsBOePONIAA6IxXO6Cd1_EurYKvcjGhe1DoenTMeQVOfMNI-B9Wa6Y7x8WT94GhET0omPrxPXIySgT0We_X1BtCv6aCRB_BTkGdOwaBdLSIOXCH5eO6FH-QTDaERZOIOHsd9eY6MwOMCeR1ehxOu0RB86zdRNlE9VTG53KsOEZx53ajcB_ZOU36fl6pv0EaDH9TBVw8xHqCJmpLwXaUIJstDen7hA2UX9gCf7sTx1u1y8pKf4vZFOPKa5PfYXT1EFYagS0lsBJP3GwkCkTXuzYM77nbAET1EFYagSZBlEFHSFP-c.'
          },
        data: data
    };

    try {
        const response = await axios.request(config);
        let lastMessage = '';

        response.data.split('\n').forEach(line => {
            if (line.startsWith('data:')) {
                const json = JSON.parse(line.replace('data: ', ''));
                if (json.choices && json.choices[0].delta.content) {
                    lastMessage = json.choices[0].delta.content;
                }
            }
        });

        res.json({ message: lastMessage });
    } catch (error) {
        console.error('Error making request:', error);
        res.status(500).json({ error: 'Error making API request' });
    }
};
