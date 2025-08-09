const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: {
    type: String,
    enum: ['To Apply', 'Applied', 'Interview', 'Results Announced'],
    default: 'To Apply'
  },
  appliedDate: { type: Date, default: Date.now },
  notes: { type: String },
  jobUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
