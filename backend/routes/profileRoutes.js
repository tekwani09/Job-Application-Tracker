const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getProfile, updateProfile, parseResume, parseResumeFile } = require('../controllers/profileController');

const router = express.Router();

router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, updateProfile);
router.post('/parse-resume', authMiddleware, parseResume);
router.post('/parse-resume-file', authMiddleware, upload.single('resume'), parseResumeFile);

module.exports = router;