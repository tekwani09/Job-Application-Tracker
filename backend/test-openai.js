const axios = require('axios');
require('dotenv').config();

const testGroq = async () => {
  try {
    console.log('Testing Groq API...');
    console.log('API Key:', process.env.GROQ_API_KEY ? 'Present' : 'Missing');

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [{
          role: 'user',
          content: 'Say "Hello, Groq integration is working!"'
        }],
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Success!');
    console.log('Response:', response.data.choices[0].message.content);
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
};

testGroq();