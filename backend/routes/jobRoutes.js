const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createJob, createJobFromUrl, updateJob, deleteJob, getJobs, getSingleJob, getJobSuggestions, getRecommendedJobs } = require('../controllers/jobController');

const router = express.Router();

router.post('/', authMiddleware, createJob); // Protected
router.post('/extract-url', authMiddleware, createJobFromUrl); // New URL extraction endpoint
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);
router.get('/', authMiddleware, getJobs);
router.get('/:id', authMiddleware, getSingleJob);
router.get('/:id/suggestions', authMiddleware, getJobSuggestions);
router.get('/recommendations/daily', authMiddleware, getRecommendedJobs);

module.exports = router;
