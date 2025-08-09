const axios = require('axios');

const getResumeSuggestions = async (jobDetails, userResumeText, userProfile = {}) => {
  try {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      throw new Error('Groq API key not configured');
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [{
          role: 'user',
          content: `As a technical recruiter, analyze this job posting against the resume. Provide actionable technical insights.

Job: ${jobDetails.company} - ${jobDetails.role}
Requirements: ${jobDetails.notes}
Resume: ${userResumeText.substring(0, 3000)}
Country: ${userProfile.country || 'India'}

Return ONLY JSON:
{
  "technicalSkills": ["specific missing technical skills with versions"],
  "architecturalPatterns": ["design patterns, system architecture knowledge gaps"],
  "toolsFrameworks": ["specific tools/frameworks mentioned in job but missing from resume"],
  "projectSuggestions": ["concrete project ideas that demonstrate required skills"],
  "certifications": [{"name": "certification name", "link": "https://certification-url.com"}],
  "experienceLevel": "junior/mid/senior assessment",
  "salaryRange": "estimated salary range in local currency",
  "strengthsMatch": ["technical strengths that align with job requirements"]
}`
        }],
        max_tokens: 400,
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

    const aiResponse = response.data.choices[0].message.content.trim();
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      return JSON.parse(aiResponse);
    }
    
  } catch (error) {
    console.error('Resume suggestion error:', error.message);
    return {
      technicalSkills: [],
      architecturalPatterns: [],
      toolsFrameworks: [],
      projectSuggestions: [],
      certifications: [],
      experienceLevel: 'Unable to assess',
      salaryRange: 'Unable to estimate',
      strengthsMatch: []
    };
  }
};

module.exports = { getResumeSuggestions };