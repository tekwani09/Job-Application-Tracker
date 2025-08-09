const User = require('../models/user');
const { parseResumeText, extractTextFromFile } = require('../services/resumeParsingService');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { profile } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profile },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const parseResume = async (req, res) => {
  try {
    const { resumeText } = req.body;
    
    if (!resumeText) {
      return res.status(400).json({ message: 'Resume text is required' });
    }

    const parsedProfile = await parseResumeText(resumeText);
    
    // Save resume text to user profile
    await User.findByIdAndUpdate(
      req.user._id,
      { 'profile.resumeText': resumeText },
      { new: true }
    );
    
    res.json(parsedProfile);
  } catch (error) {
    console.error('Parse resume error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const parseResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    const extractedText = await extractTextFromFile(req.file.buffer, req.file.mimetype);
    const parsedProfile = await parseResumeText(extractedText);
    
    // Save resume text to user profile
    await User.findByIdAndUpdate(
      req.user._id,
      { 'profile.resumeText': extractedText },
      { new: true }
    );
    
    res.json(parsedProfile);
  } catch (error) {
    console.error('Parse resume file error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, parseResume, parseResumeFile };