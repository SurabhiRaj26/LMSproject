const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// @route POST /api/progress/update
const updateProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const userId = req.user._id;

    const totalLessons = await Lesson.countDocuments({ courseId });

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({ userId, courseId, completedLessons: [], lastWatchedLesson: lessonId });
    }

    // Add lessonId if not already completed
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    progress.lastWatchedLesson = lessonId;
    progress.percentage = totalLessons > 0
      ? Math.round((progress.completedLessons.length / totalLessons) * 100)
      : 0;

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/progress/:userId
const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.params.userId })
      .populate('courseId', 'title thumbnail instructorName')
      .populate('lastWatchedLesson', 'title youtubeId order');
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/progress/course/:courseId
const getCourseProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
    }).populate('completedLessons').populate('lastWatchedLesson');

    if (!progress) return res.json({ completedLessons: [], percentage: 0, lastWatchedLesson: null });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProgress, getUserProgress, getCourseProgress };
