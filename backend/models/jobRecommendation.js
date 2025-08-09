const mongoose = require('mongoose');

const jobRecommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  location: String,
  experience: String,
  skills: [String],
  salary: String,
  postedDays: Number,
  jobUrl: String,
  shownAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
jobRecommendationSchema.index({ user: 1, company: 1, role: 1 });

module.exports = mongoose.model('JobRecommendation', jobRecommendationSchema);