const Job = require('../models/job');
const User = require('../models/user');
const { extractJobDetails } = require('../services/genaiService');
const { getResumeSuggestions } = require('../services/resumeSuggestionService');
const { getJobRecommendations } = require('../services/jobRecommendationService');

// POST /api/jobs/extract-url
const createJobFromUrl = async (req, res) => {
  const { jobUrl } = req.body;

  if (!jobUrl) {
    return res.status(400).json({ message: "Job URL is required" });
  }

  try {
    const extractedData = await extractJobDetails(jobUrl);
    
    const job = new Job({
      user: req.user._id,
      company: extractedData.company,
      role: extractedData.role,
      notes: extractedData.notes,
      jobUrl,
      status: 'To Apply'
    });
    
    const savedJob = await job.save();
    
    // Get resume suggestions for URL extracted job
    const user = await User.findById(req.user._id);
    let resumeSuggestions = null;
    
    if (user.profile?.resumeText) {
      resumeSuggestions = await getResumeSuggestions(
        { company: extractedData.company, role: extractedData.role, notes: extractedData.notes },
        user.profile.resumeText
      );
    } else {
      // Test suggestions for URL extract
      resumeSuggestions = {
        technicalSkills: ['React 18+', 'Node.js 16+', 'TypeScript 4.5+'],
        architecturalPatterns: ['Microservices', 'Event-driven architecture', 'CQRS pattern'],
        toolsFrameworks: ['Docker', 'Kubernetes', 'AWS Lambda'],
        projectSuggestions: ['Build a scalable REST API with Node.js', 'Create a React dashboard with real-time updates'],
        certifications: [
          {"name": "AWS Solutions Architect", "link": "https://aws.amazon.com/certification/certified-solutions-architect-associate/"},
          {"name": "Google Cloud Professional", "link": "https://cloud.google.com/certification/cloud-architect"}
        ],
        experienceLevel: 'Mid-level (3-5 years)',
        salaryRangeINR: '₹8 - ₹15 LPA',
        strengthsMatch: ['Strong JavaScript fundamentals', 'Experience with REST APIs']
      };
    }
    
    res.status(201).json({ job: savedJob, resumeSuggestions });
  } catch (error) {
    console.error("Create Job from URL Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/jobs
const createJob = async (req, res) => {
  const { company, role, status, appliedDate, notes, jobUrl } = req.body;

    console.log('📦 Incoming Job Data:', req.body);
    console.log('🔐 User from token:', req.user);

  if (!company || !role) {
    return res.status(400).json({ message: "Company and Role are required" });
  }

  try {
    const job = new Job({
      user: req.user._id,
      company,
      role,
      status,
      appliedDate,
      notes,
      jobUrl
    });
    const savedJob = await job.save();
    
    // Get resume suggestions if user has resume text
    const user = await User.findById(req.user._id);
    let resumeSuggestions = null;
    
    console.log('User profile:', user.profile);
    
    if (user.profile?.resumeText) {
      console.log('Getting resume suggestions...');
      resumeSuggestions = await getResumeSuggestions(
        { company, role, notes },
        user.profile.resumeText
      );
      console.log('Resume suggestions:', resumeSuggestions);
    } else {
      console.log('No resume text found in user profile');
      // Force show test suggestions
      resumeSuggestions = {
        technicalSkills: ['React 18+', 'Node.js 16+', 'TypeScript 4.5+'],
        architecturalPatterns: ['Microservices', 'Event-driven architecture', 'CQRS pattern'],
        toolsFrameworks: ['Docker', 'Kubernetes', 'AWS Lambda'],
        projectSuggestions: ['Build a scalable REST API with Node.js', 'Create a React dashboard with real-time updates'],
        certifications: [
          {"name": "AWS Solutions Architect", "link": "https://aws.amazon.com/certification/certified-solutions-architect-associate/"},
          {"name": "Google Cloud Professional", "link": "https://cloud.google.com/certification/cloud-architect"}
        ],
        experienceLevel: 'Mid-level (3-5 years)',
        salaryRangeINR: '₹8 - ₹15 LPA',
        strengthsMatch: ['Strong JavaScript fundamentals', 'Experience with REST APIs']
      };
    }
    
    res.status(201).json({ job: savedJob, resumeSuggestions });
  } catch (error) {
    console.error("Create Job Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/jobs/:id
const updateJob = async (req, res) => {
  const { id } = req.params;
  const { company, role, status, appliedDate, notes } = req.body;

  try {
    const job = await Job.findOne({ _id: id, user: req.user._id });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.company = company || job.company;
    job.role = role || job.role;
    job.status = status || job.status;
    job.appliedDate = appliedDate || job.appliedDate;
    job.notes = notes || job.notes;

    const updatedJob = await job.save();
    
    // Get resume suggestions for updated job
    const user = await User.findById(req.user._id);
    let resumeSuggestions = null;
    
    if (user.profile?.resumeText) {
      resumeSuggestions = await getResumeSuggestions(
        { company: updatedJob.company, role: updatedJob.role, notes: updatedJob.notes },
        user.profile.resumeText
      );
    }
    
    res.status(200).json({ job: updatedJob, resumeSuggestions });
  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findOneAndDelete({ _id: id, user: req.user._id });
id
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const { status, sortBy, order } = req.query;

    const queryObject = {
      user: req.user._id,
    };

    // Filter by status if provided
    if (status && status !== 'All') {
      queryObject.status = status;
    }

    let jobQuery = Job.find(queryObject);

    // Apply sorting
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      jobQuery = jobQuery.sort({ [sortBy]: sortOrder });
    }

    const jobs = await jobQuery;
    res.status(200).json(jobs);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

// GET /api/jobs/:id
const getSingleJob = async (req, res) => {
  const { id } = req.params;

  console.log("📥 Getting job for ID:", id);
  console.log("🔐 User from token:", req.user);
  try {
    const job = await Job.findById({ _id: id, user: req.user._id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};  

const getJobSuggestions = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findOne({ _id: id, user: req.user._id });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    const user = await User.findById(req.user._id);
    let resumeSuggestions = null;
    
    try {
      if (user.profile?.resumeText) {
        resumeSuggestions = await getResumeSuggestions(
          { company: job.company, role: job.role, notes: job.notes },
          user.profile.resumeText,
          user.profile
        );
      } else {
        // Generate suggestions based on job role
        const roleBasedSuggestions = {
          'Software Engineer': {
            technicalSkills: ['Data Structures', 'Algorithms', 'System Design'],
            toolsFrameworks: ['Git', 'Docker', 'CI/CD'],
            salaryRange: '₹6 - ₹12 LPA'
          },
          'Java': {
            technicalSkills: ['Spring Boot', 'Hibernate', 'Maven'],
            toolsFrameworks: ['Spring Framework', 'JUnit', 'MySQL'],
            salaryRange: '₹8 - ₹15 LPA'
          }
        };
        
        const roleKey = Object.keys(roleBasedSuggestions).find(key => 
          job.role.toLowerCase().includes(key.toLowerCase())
        );
        
        const baseSuggestions = roleKey ? roleBasedSuggestions[roleKey] : roleBasedSuggestions['Software Engineer'];
        
        resumeSuggestions = {
          technicalSkills: baseSuggestions.technicalSkills,
          architecturalPatterns: ['MVC Pattern', 'Repository Pattern'],
          toolsFrameworks: baseSuggestions.toolsFrameworks,
          projectSuggestions: [`Build a ${job.role} project`, 'Create a portfolio website'],
          certifications: [
            {"name": "Oracle Java Certification", "link": "https://education.oracle.com/java-certification"},
            {"name": "AWS Developer Associate", "link": "https://aws.amazon.com/certification/certified-developer-associate/"}
          ],
          experienceLevel: 'Mid-level (2-4 years)',
          salaryRange: baseSuggestions.salaryRange,
          strengthsMatch: ['Problem solving skills', 'Programming fundamentals']
        };
      }
    } catch (error) {
      console.error('Error getting resume suggestions:', error);
      resumeSuggestions = {
        technicalSkills: ['Programming fundamentals', 'Problem solving'],
        experienceLevel: 'Entry to Mid-level',
        salaryRange: '₹6 - ₹12 LPA',
        strengthsMatch: ['Analytical thinking']
      };
    }
    
    res.json(resumeSuggestions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    console.log('User profile:', user.profile);
    
    // Create default profile if missing
    const profile = user.profile || {
      skills: ['JavaScript', 'React'],
      experience: 2,
      location: 'India',
      preferredRoles: ['Developer'],
      education: 'Bachelor\'s Degree'
    };
    
    const recommendations = await getJobRecommendations(profile, req.user._id);
    console.log('Final recommendations:', recommendations);
    res.json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  createJob,
  createJobFromUrl,
  updateJob,
  deleteJob,
  getJobs,
  getSingleJob,
  getJobSuggestions,
  getRecommendedJobs,
};
