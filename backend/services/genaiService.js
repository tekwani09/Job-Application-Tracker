const axios = require('axios');

const extractJobDetails = async (jobUrl) => {
  try {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      throw new Error('Groq API key not configured');
    }

    const openaiResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [{
          role: 'user',
          content: `Visit this job posting URL and extract the job details: ${jobUrl}. Return ONLY a valid JSON object with exactly these fields: {"company": "company name", "role": "job title", "notes": "brief job description"}`
        }],
        max_tokens: 300,
        temperature: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    const aiResponse = openaiResponse.data.choices[0].message.content.trim();
    const jsonMatch = aiResponse.match(/\{[^}]+\}/s);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      return JSON.parse(aiResponse);
    }
    
  } catch (error) {
    console.error('GenAI extraction error:', error.message);
    if (error.response?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.');
    }
    if (error.message.includes('OpenAI API key')) {
      throw new Error('OpenAI API key not configured. Please add your API key to .env file');
    }
    throw new Error('Failed to extract job details from URL');
  }
};

module.exports = { extractJobDetails };