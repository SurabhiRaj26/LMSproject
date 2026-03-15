const express = require('express');
const router = express.Router();
const { updateProgress, getUserProgress, getCourseProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.post('/update', protect, updateProgress);
router.get('/:userId', protect, getUserProgress);
router.get('/course/:courseId', protect, getCourseProgress);

module.exports = router;
