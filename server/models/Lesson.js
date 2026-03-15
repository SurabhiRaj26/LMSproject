const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
    youtubeId: { type: String, required: true },
    description: { type: String, default: '' },
    duration: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);
