const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    skills: [String],
    experience: { type: Number, default: 0 },
    location: String,
    preferredRoles: [String],
    education: String,
    resume: String,
    portfolio: String,
    linkedin: String,
    github: String,
    resumeText: String,
    country: { type: String, default: 'India' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
