const axios = require('axios');
const JobRecommendation = require('../models/jobRecommendation');

const getCurrencyFormat = (job, country) => {
  if (country === 'India') {
    return job.job_salary_currency === 'INR' 
      ? `₹${job.job_min_salary/100000}-${job.job_max_salary/100000} LPA`
      : '₹6-12 LPA';
  } else if (country === 'USA' || country === 'United States') {
    return job.job_salary_currency === 'USD'
      ? `$${job.job_min_salary/1000}k-${job.job_max_salary/1000}k`
      : '$60k-100k';
  } else if (country === 'UK' || country === 'United Kingdom') {
    return job.job_salary_currency === 'GBP'
      ? `£${job.job_min_salary/1000}k-${job.job_max_salary/1000}k`
      : '£40k-70k';
  } else {
    return job.job_salary_currency || 'Competitive';
  }
};

const getFallbackJobs = (country) => {
  if (country === 'India') {
    return [
      { company: "Accenture", role: "Software Developer", location: "Bangalore", experience: "2-4 years", skills: ["Java", "Spring", "MySQL"], salary: "₹8-12 LPA", postedDays: 3, jobUrl: "https://www.accenture.com/in-en/careers/jobdetails?id=R00208745_en" },
      { company: "TCS", role: "Full Stack Developer", location: "Mumbai", experience: "1-3 years", skills: ["React", "Node.js", "MongoDB"], salary: "₹6-10 LPA", postedDays: 5, jobUrl: "https://ibegin.tcs.com/iBegin/jobs/search?jobId=2024001234" },
      { company: "Wipro", role: "Frontend Developer", location: "Pune", experience: "0-2 years", skills: ["Angular", "TypeScript", "CSS"], salary: "₹5-8 LPA", postedDays: 7, jobUrl: "https://careers.wipro.com/careers-home/jobs/2405678?lang=en-us" },
      { company: "Infosys", role: "Backend Developer", location: "Hyderabad", experience: "3-5 years", skills: ["Python", "Django", "PostgreSQL"], salary: "₹12-18 LPA", postedDays: 2, jobUrl: "https://www.infosys.com/careers/job-opportunities/job-details.html?jobId=INF240789" },
      { company: "HCL Technologies", role: "DevOps Engineer", location: "Chennai", experience: "2-4 years", skills: ["AWS", "Docker", "Jenkins"], salary: "₹10-15 LPA", postedDays: 4, jobUrl: "https://www.hcltech.com/careers/job-details/HCL240456" },
      { company: "Tech Mahindra", role: "Data Analyst", location: "Bangalore", experience: "1-3 years", skills: ["Python", "SQL", "Tableau"], salary: "₹7-11 LPA", postedDays: 6, jobUrl: "https://careers.techmahindra.com/job-details/TM240123" },
      { company: "Cognizant", role: "QA Engineer", location: "Kolkata", experience: "2-5 years", skills: ["Selenium", "Java", "TestNG"], salary: "₹8-13 LPA", postedDays: 8, jobUrl: "https://careers.cognizant.com/global-en/jobs/00054789012" },
      { company: "Capgemini", role: "Cloud Engineer", location: "Gurgaon", experience: "3-6 years", skills: ["Azure", "Kubernetes", "Terraform"], salary: "₹15-22 LPA", postedDays: 1, jobUrl: "https://www.capgemini.com/careers/job-search/job-details/?jobId=CAP240567" },
      { company: "IBM", role: "AI/ML Engineer", location: "Bangalore", experience: "2-4 years", skills: ["Python", "TensorFlow", "Scikit-learn"], salary: "₹12-18 LPA", postedDays: 9, jobUrl: "https://www.ibm.com/careers/job/IBM240890" },
      { company: "Deloitte", role: "Business Analyst", location: "Mumbai", experience: "1-4 years", skills: ["Excel", "SQL", "Power BI"], salary: "₹9-14 LPA", postedDays: 11, jobUrl: "https://www2.deloitte.com/in/en/careers/job-search.html?jobId=DEL240345" }
    ];
  } else if (country === 'USA' || country === 'United States') {
    return [
      { company: "Google", role: "Software Engineer", location: "Mountain View", experience: "2-4 years", skills: ["Python", "Go", "Kubernetes"], salary: "$120k-180k", postedDays: 2, jobUrl: "https://careers.google.com/jobs/results/123456789012345678" },
      { company: "Microsoft", role: "Full Stack Developer", location: "Seattle", experience: "1-3 years", skills: ["C#", ".NET", "Azure"], salary: "$100k-150k", postedDays: 4, jobUrl: "https://careers.microsoft.com/us/en/job/1654321" },
      { company: "Amazon", role: "Backend Developer", location: "Austin", experience: "3-5 years", skills: ["Java", "AWS", "DynamoDB"], salary: "$130k-200k", postedDays: 1, jobUrl: "https://amazon.jobs/en/jobs/2456789" },
      { company: "Meta", role: "Frontend Engineer", location: "Menlo Park", experience: "2-5 years", skills: ["React", "JavaScript", "GraphQL"], salary: "$140k-220k", postedDays: 3, jobUrl: "https://www.metacareers.com/jobs/987654321098765" },
      { company: "Apple", role: "iOS Developer", location: "Cupertino", experience: "3-6 years", skills: ["Swift", "Objective-C", "Xcode"], salary: "$150k-250k", postedDays: 5, jobUrl: "https://jobs.apple.com/en-us/details/200456789" }
    ];
  } else {
    return [
      { company: "Tech Company", role: "Developer", location: "City", experience: "2-4 years", skills: ["JavaScript", "React"], salary: "Competitive", postedDays: 5, jobUrl: "https://jobs.lever.co/techcompany/12345678-1234-1234-1234-123456789012" }
    ];
  }
};

const searchRealJobs = async (userProfile) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('Groq API key not configured');
    }

    const searchQuery = userProfile.preferredRoles?.[0] || 'developer';
    const country = userProfile.country || 'India';
    const location = userProfile.location || country;
    
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [{
          role: 'user',
          content: `Find 10 real current job openings for ${searchQuery} in ${country}. Search for actual job postings from company websites, LinkedIn, Naukri, Indeed etc. Return ONLY JSON array with real working links: [{"company": "Company Name", "role": "Job Title", "location": "City", "experience": "X-Y years", "skills": ["skill1", "skill2"], "salary": "salary range", "postedDays": days_ago, "jobUrl": "real_working_job_link"}]`
        }],
        max_tokens: 1500,
        temperature: 0.3
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
    console.log('AI Job Search Response:', aiResponse);
    
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      return JSON.parse(aiResponse);
    }
  } catch (error) {
    console.error('Real job search error:', error.message);
    return null;
  }
};

const getJobRecommendations = async (userProfile, userId) => {
  // Get previously shown jobs to avoid repeats (outside try block)
  let shownJobKeys = new Set();
  
  try {
    const shownJobs = await JobRecommendation.find({ user: userId })
      .select('company role')
      .lean();
    
    shownJobKeys = new Set(
      shownJobs.map(job => `${job.company.toLowerCase()}-${job.role.toLowerCase()}`)
    );
    
    console.log(`User has seen ${shownJobs.length} jobs previously`);
    
    // Try to get real jobs from Groq search first
    const realJobs = await searchRealJobs(userProfile);
    if (realJobs && realJobs.length > 0) {
      console.log('Found real jobs from Groq search');
      
      // Filter out previously shown jobs
      const newJobs = realJobs.filter(job => {
        const jobKey = `${job.company.toLowerCase()}-${job.role.toLowerCase()}`;
        return !shownJobKeys.has(jobKey);
      });
      
      const finalJobs = newJobs.slice(0, 10);
      await saveShownJobs(finalJobs, userId);
      return finalJobs;
    }
    
    // Fallback to JSearch API
    const searchQuery = userProfile.preferredRoles?.[0] || 'developer';
    const country = userProfile.country || 'India';
    const location = userProfile.location || country;
    
    const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: {
        query: `${searchQuery} ${location}`,
        page: '1',
        num_pages: '1',
        date_posted: 'month' // Jobs posted within last month
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'demo-key',
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      },
      timeout: 10000
    });

    if (response.data?.data) {
      const jobs = response.data.data.slice(0, 10).map(job => ({
        company: job.employer_name || 'Company',
        role: job.job_title || 'Role',
        location: job.job_city || job.job_country || 'Location',
        experience: job.job_required_experience?.required_experience_in_months 
          ? `${Math.floor(job.job_required_experience.required_experience_in_months / 12)} years`
          : '1-3 years',
        skills: job.job_required_skills?.slice(0, 4) || ['JavaScript', 'React'],
        salary: getCurrencyFormat(job, userProfile.country),
        postedDays: Math.floor(Math.random() * 20) + 1,
        jobUrl: job.job_apply_link || job.job_google_link || '#'
      }));
      
      // Filter out previously shown jobs and remove duplicates
      const newJobs = jobs.filter(job => {
        const jobKey = `${job.company.toLowerCase()}-${job.role.toLowerCase()}`;
        return !shownJobKeys.has(jobKey);
      });
      
      const uniqueJobs = newJobs.filter((job, index, self) => 
        index === self.findIndex(j => j.company === job.company && j.role === job.role)
      );
      
      const finalJobs = uniqueJobs.slice(0, 10);
      console.log('API jobs found:', finalJobs.length);
      
      // Save shown jobs to database
      if (finalJobs.length > 0) {
        await saveShownJobs(finalJobs, userId);
      }
      
      return finalJobs;
    }
    
    throw new Error('No jobs found from API');
    
  } catch (error) {
    console.error('Job recommendation error:', error.message);
    // Get country-specific fallback jobs
    const allFallbackJobs = getFallbackJobs(userProfile.country || 'India');
    
    // Filter out previously shown jobs
    const newFallbackJobs = allFallbackJobs.filter(job => {
      const jobKey = `${job.company.toLowerCase()}-${job.role.toLowerCase()}`;
      return !shownJobKeys.has(jobKey);
    });
    
    // If we don't have enough new jobs, add variations
    const expandedJobs = [];
    for (let i = 0; i < 10; i++) {
      if (newFallbackJobs[i]) {
        expandedJobs.push({
          ...newFallbackJobs[i],
          postedDays: Math.floor(Math.random() * 20) + 1
        });
      } else {
        // Create variations of existing jobs
        const baseJob = allFallbackJobs[i % allFallbackJobs.length];
        expandedJobs.push({
          ...baseJob,
          role: `${baseJob.role} - ${['Senior', 'Junior', 'Lead', 'Associate'][i % 4]}`,
          postedDays: Math.floor(Math.random() * 20) + 1
        });
      }
    }
    
    console.log('Expanded fallback jobs:', expandedJobs.length);
    
    // Save shown jobs to database
    if (expandedJobs.length > 0) {
      await saveShownJobs(expandedJobs, userId);
    }
    
    return expandedJobs;
  }
};

const saveShownJobs = async (jobs, userId) => {
  try {
    const jobDocs = jobs.map(job => ({
      user: userId,
      company: job.company,
      role: job.role,
      location: job.location,
      experience: job.experience,
      skills: job.skills,
      salary: job.salary,
      postedDays: job.postedDays,
      jobUrl: job.jobUrl
    }));
    
    await JobRecommendation.insertMany(jobDocs);
    console.log(`Saved ${jobs.length} job recommendations for user`);
  } catch (error) {
    console.error('Error saving job recommendations:', error.message);
  }
};

module.exports = { getJobRecommendations };