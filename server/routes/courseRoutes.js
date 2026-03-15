const express = require('express');
const router = express.Router();
const {
  getCourses, getCourseById, createCourse, updateCourse,
  deleteCourse, enrollCourse, getMyCourses,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/my-courses', protect, authorize('instructor', 'admin'), getMyCourses);
router.get('/:id', getCourseById);
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);
router.post('/:id/enroll', protect, enrollCourse);

module.exports = router;
