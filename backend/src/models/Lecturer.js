const mongoose = require('mongoose');

const lecturerSchema = new mongoose.Schema(
  {
    lecturerId: { type: String, required: true, unique: true, trim: true },
    surname: { type: String, required: true, trim: true },
    firstname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    department: { type: String, required: true, trim: true },
    phoneNumber: { type: String, trim: true },   // fixed: was 'phone' in routes, 'phonenumber' in schema
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    title: { type: String, enum: ['Prof', 'Dr', 'Mr', 'Mrs', 'Ms'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lecturer', lecturerSchema);
