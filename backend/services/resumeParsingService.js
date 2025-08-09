const axios = require('axios');
const pdfParse = require('pdf-parse');

const extractTextFromFile = async (fileBuffer, mimetype) => {
  try {
    let text = '';
    
    if (mimetype === 'application/pdf') {
      const pdfData = await pdfParse(fileBuffer);
      text = pdfData.text;
      console.log(`PDF extracted text length: ${text.length}`);
    } else if (mimetype === 'text/plain') {
      text = fileBuffer.toString('utf-8');
    } else {
      // Fallback for DOC/DOCX files
      text = fileBuffer.toString('utf-8').replace(/[^\x20-\x7E\n\r]/g, ' ');
    }
    
    // Clean up text
    const cleanText = text
      .replace(/\s+/g, ' ')
      .trim();
      
    console.log(`Final cleaned text length: ${cleanText.length}`);
    return cleanText;
  } catch (error) {
    console.error('Text extraction error:', error.message);
    throw new Error('Failed to extract text from file');
  }
};

const parseResumeChunk = async (chunk, existingData = {}) => {
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama3-8b-8192',
      messages: [{
        role: 'user',
        content: `Extract ALL information from this resume chunk. MUST extract both technical skills AND preferred job roles. Look for:
- Skills: programming languages, frameworks, tools, technologies
- Preferred Roles: job titles from objective/summary/career goals
- Experience: years of work experience
- Location & Country: from address/contact info

Current accumulated data: ${JSON.stringify(existingData)}

Return ONLY valid JSON with ALL fields filled:
{
  "skills": ["list all technical skills found"],
  "experience": number_of_years,
  "location": "city, state",
  "preferredRoles": ["list all job roles/titles mentioned"],
  "education": "degree info",
  "linkedin": "profile_url",
  "github": "profile_url",
  "portfolio": "website_url",
  "country": "country_name"
}

Resume chunk: ${chunk}`
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
  console.log('AI Response for chunk:', aiResponse);
  
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
    
    // Ensure arrays are properly formatted and not empty
    if (parsed.skills && !Array.isArray(parsed.skills)) {
      parsed.skills = [parsed.skills];
    }
    if (!parsed.skills || parsed.skills.length === 0) {
      parsed.skills = [];
    }
    
    if (parsed.preferredRoles && !Array.isArray(parsed.preferredRoles)) {
      parsed.preferredRoles = [parsed.preferredRoles];
    }
    if (!parsed.preferredRoles || parsed.preferredRoles.length === 0) {
      parsed.preferredRoles = [];
    }
    
    console.log('Parsed chunk - Skills:', parsed.skills, 'Roles:', parsed.preferredRoles);
    return parsed;
  } catch (parseError) {
    console.log('Parse error:', parseError.message);
    return {
      skills: [],
      experience: 0,
      location: '',
      preferredRoles: [],
      education: '',
      linkedin: '',
      github: '',
      portfolio: '',
      country: 'India'
    };
  }
};

const formatUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `https://${url}`;
};

const mergeProfileData = (existing, newData) => {
  return {
    skills: [...new Set([...(existing.skills || []), ...(newData.skills || [])])],
    experience: Math.max(existing.experience || 0, newData.experience || 0),
    location: newData.location || existing.location || '',
    preferredRoles: [...new Set([...(existing.preferredRoles || []), ...(newData.preferredRoles || [])])],
    education: newData.education || existing.education || '',
    linkedin: formatUrl(newData.linkedin || existing.linkedin || ''),
    github: formatUrl(newData.github || existing.github || ''),
    portfolio: formatUrl(newData.portfolio || existing.portfolio || ''),
    country: newData.country || existing.country || 'India'
  };
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const parseResumeText = async (resumeText) => {
  try {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      throw new Error('Groq API key not configured');
    }

    console.log(`Total resume characters: ${resumeText.length}`);
    const chunkSize = 2000;
    const totalChunks = Math.ceil(resumeText.length / chunkSize);
    console.log(`Processing ${totalChunks} chunks of ${chunkSize} characters each`);
    
    let profileData = {};
    
    for (let i = 0; i < resumeText.length; i += chunkSize) {
      const chunkIndex = Math.floor(i / chunkSize) + 1;
      const chunk = resumeText.substring(i, i + chunkSize);
      console.log(`Processing chunk ${chunkIndex}/${totalChunks} (${chunk.length} chars)`);
      
      try {
        const chunkData = await parseResumeChunk(chunk, profileData);
        profileData = mergeProfileData(profileData, chunkData);
        console.log(`Chunk ${chunkIndex} processed - Total skills: ${profileData.skills?.length || 0}, Total roles: ${profileData.preferredRoles?.length || 0}`);
      } catch (error) {
        if (error.response?.status === 429) {
          console.log(`Rate limit hit on chunk ${chunkIndex}, waiting 5 seconds...`);
          await sleep(5000);
          try {
            const chunkData = await parseResumeChunk(chunk, profileData);
            profileData = mergeProfileData(profileData, chunkData);
            console.log(`Chunk ${chunkIndex} retry successful`);
          } catch (retryError) {
            console.log(`Chunk ${chunkIndex} retry failed, skipping...`);
          }
        } else {
          console.log(`Chunk ${chunkIndex} failed with error:`, error.message);
        }
      }
      
      // Add delay between chunks
      if (i + chunkSize < resumeText.length) {
        await sleep(2000);
      }
    }
    
    console.log('Resume parsing completed');
    return profileData;
    
  } catch (error) {
    console.error('Resume parsing error:', error.message);
    throw new Error('Failed to parse resume');
  }
};

module.exports = { parseResumeText, extractTextFromFile };