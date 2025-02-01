const axios = require('axios');
const FormData = require('form-data');

module.exports.routes = {
  name: "Gpt4o-pro",
  description: "Ask questions with GPT4o Pro",
  usages: "/api/gpt4o-pro",
  query: "?q=hello&uid=1",
  method: "get",
  category: "AI Tools",
};

module.exports.onAPI = async (req, res) => {
  try {
    const ask = req.query.q || "What is my last ask question?";
    const id = req.query.uid || "1";
    const imageUrl = req.query.imageUrl || "";

    let data = new FormData();
    data.append(
      "messageList",
      `[{"type":"TEXT","content":"${ask}","senderType":"USER","chatSessionId":"${id}","messageId":"${id}-${Date.now()}"}]`
    );
    data.append("appNameId", "AKIHACHIAI-27409");
    data.append("chatType", "ChippHosted");
    data.append(
      "applicationCapabilities",
      '[{"id":191619,"name":"Monetization","description":"Add payment processing features into your app, allowing for purchasing usage credits and monthly subscriptions to your app.","enabled":false,"applicationId":27409,"createdAt":"2024-12-02T12:20:33.980Z","updatedAt":"2024-12-02T12:20:33.980Z"},{"id":191620,"name":"User Signup","description":"Activate user registration and authentication capabilities, ensuring a personalized and secure user experience.","enabled":false,"applicationId":27409,"createdAt":"2024-12-02T12:20:33.980Z","updatedAt":"2024-12-02T12:20:33.980Z"},{"id":191621,"name":"File Upload","description":"Allow users to upload files to be analyzed by OpenAI\'s Code Interpreter.","enabled":true,"applicationId":27409,"createdAt":"2024-12-02T12:20:33.980Z","updatedAt":"2024-12-02T12:20:33.980Z"},{"id":191622,"name":"Image Generation","description":"Use OpenAI\'s DALL-E model to generate images based on user prompts.","enabled":true,"applicationId":27409,"createdAt":"2024-12-02T12:20:33.980Z","updatedAt":"2024-12-02T12:20:33.980Z"},{"id":191623,"name":"Image Recognition","description":"Use OpenAI\'s GPT-4V to recognize images uploaded by the user.","enabled":true,"applicationId":27409,"createdAt":"2024-12-02T12:20:33.980Z","updatedAt":"2024-12-02T12:20:33.980Z"},{"id":191624,"name":"Image Recognition with Pixtral","description":"Use Mistral\'s Pixtral model to recognize images uploaded by the user.","enabled":true,"applicationId":27409,"createdAt":"2024-12-02T12:20:33.980Z","updatedAt":"2024-12-02T12:20:33.980Z"},{"id":191625,"name":"URL Retrieval","description":"Allow users to retrieve content by URL from the internet.","enabled":true,"applicationId":27409,"createdAt":"2024-12-02T12:20:33.980Z","updatedAt":"2024-12-02T12:20:33.980Z"},{"id":191626,"name":"Browse Web","description":"Allow users to browse the web and retrieve content from websites.","enabled":true,"applicationId":27409,"createdAt":"2024-12-02T12:20:33.980Z","updatedAt":"2024-12-02T12:20:33.980Z"}]'
    );
    data.append(
      "tools",
      '[{"type":"function","function":{"name":"generate_image","description":"Generate an image based on a prompt in response to a user query. Only call this function if the user has requested an image. You MUST specify the \'prompt\' argument for this function. You will be graded on how well you construct the prompt.","parameters":{"type":"object","properties":{"prompt":{"type":"string","description":"The prompt to generate the image from. Use the user\'s query to generate the image. You MUST specify a value for this. You will be graded on how well you construct this prompt."}},"required":["prompt"]}}},{"type":"function","function":{"name":"analyze_image","description":"Analyze an image in order to answer a user query. Only call this function if the user has requested image recognition. This function cannot be called for any file starting with \\"file-\\" - such files can only be processed with code interpreter. The imageUrl provided should always be the link to the image that the user has provided within the Chipp system prompt tags. The userQuery should be a detailed question about the image.","parameters":{"type":"object","properties":{"userQuery":{"type":"string","description":"The question that the user is asking regarding the image. You can rewrite this to be more concise. It needs to be in the form of a question and it needs to be very detailed and descriptive to help better analyze the image. You will be graded on how well you construct this query."},"imageUrl":{"type":"string","description":"The url for the image."}},"required":["imageUrl","userQuery"]}}},{"type":"function","function":{"name":"retrieve_url","description":"Retrieve a URL from the internet. Only call this function if the user has requested a URL retrieval based on providing an actual URL or if the user references a URL in the chat history semantically. You will be graded on how well you construct the prompt.","parameters":{"type":"object","properties":{"url":{"type":"string","description":"The url to retrieve. You will be graded on how well you construct this url."}},"required":["url"]}}},{"type":"function","function":{"name":"browse_web","description":"Browse the web. Used when you need to answer questions you may not know the answer to, current events, latest updated information, or for questions that require the internet. The query paramter should be the exact question as asked by the user. You will be graded on how well you construct the prompt.","parameters":{"type":"object","properties":{"query":{"type":"string","description":"The query to search for on the web. This should be the exact question asked by the user. You will be graded on how well you construct this query."}},"required":["query"]}}},{"type":"code_interpreter"}]'
    );

    // Add imageUrl if provided
    if (imageUrl) {
      data.append("imageUrl", imageUrl);
    }

    let config = {
      method: "POST",
      url: "https://akihachiai-27409.chipp.ai/w/chat/api/openai/chat",
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "sec-ch-ua-platform": '"Android"',
        "sec-ch-ua": '"Chromium";v="130", "Brave";v="130", "Not?A_Brand";v="99"',
        "content-type": `multipart/form-data; boundary=${data._boundary}`,
        "sec-ch-ua-mobile": "?1",
        "sec-gpc": "1",
        "accept-language": "en-US,en;q=0.5",
        "origin": "https://akihachiai-27409.chipp.ai",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        "referer": "https://akihachiai-27409.chipp.ai/w/chat",
        "priority": "u=1, i",
        "Cookie":
          "ph_phc_58R4nRj6BbHvFBIwUiMlHyD8X7B5xrup5HMX1EDFsFw_posthog=%7B%22distinct_id%22%3A%220193a2ed-965f-71a2-a006-3220b996d7c4%22%2C%22%24sesid%22%3A%5B1733616418088%2C%220193a390-9dcc-7f07-a20f-197cc93badfe%22%2C1733615984076%5D%7D; __Host-next-auth.csrf-token=dc8b1c8b011c0d3d2bccd9565b472eccfef8df732386098ea5afd7f524d92d32%7C73c4ad40356335ce2c4108bf644436c4d1b97ac1be652936d05f6792350fd928; __Secure-next-auth.callback-url=https%3A%2F%2Fapp.chipp.ai",
      },
      data: data,
    };

    const response = await axios.request(config);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
