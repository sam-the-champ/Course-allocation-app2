const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true, unique: true, trim: true, uppercase: true },
    courseTitle: { type: String, required: true, trim: true },
    semester: { type: String, required: true, enum: ['First', 'Second'] },
    unit: { type: Number, required: true, min: 1, max: 6 },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
