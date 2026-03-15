const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// @route GET /api/lessons/:courseId
const getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.courseId }).sort({ order: 1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/lessons/single/:id
const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/lessons
const createLesson = async (req, res) => {
  try {
    const { courseId, title, order, youtubeId, description, duration } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const lesson = await Lesson.create({ courseId, title, order, youtubeId, description, duration });

    // Update total lessons count
    await Course.findByIdAndUpdate(courseId, { $inc: { totalLessons: 1 } });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/lessons/:id
const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/lessons/:id
const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    await lesson.deleteOne();
    await Course.findByIdAndUpdate(lesson.courseId, { $inc: { totalLessons: -1 } });
    res.json({ message: 'Lesson deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLessonsByCourse, getLessonById, createLesson, updateLesson, deleteLesson };
