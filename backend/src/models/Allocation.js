const mongoose = require('mongoose');

// Allocation is now a proper collection — not embedded inside Lecturer.
// This enables querying, filtering, and scaling without touching the Lecturer document.
const allocationSchema = new mongoose.Schema(
  {
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecturer',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    level: { type: String, required: true, trim: true },          // e.g. "100", "200", "HND1"
    semester: { type: String, required: true, enum: ['First', 'Second'] },
    classDate: { type: String, required: true },                  // e.g. "Monday"
    classTime: { type: String, required: true },                  // e.g. "10:00 AM"
    academicSession: { type: String, required: true, trim: true }, // e.g. "2024/2025"
  },
  { timestamps: true }
);

// Prevent duplicate allocation of the same course to the same lecturer in the same session/level/semester
allocationSchema.index(
  { lecturer: 1, course: 1, level: 1, semester: 1, academicSession: 1 },
  { unique: true }
);

module.exports = mongoose.model('Allocation', allocationSchema);
