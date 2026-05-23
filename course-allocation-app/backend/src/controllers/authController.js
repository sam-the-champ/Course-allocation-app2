const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Lecturer = require('../models/Lecturer');

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });

// POST /api/auth/admin/login
const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = signToken({ id: admin._id, role: 'admin', username: admin.username });

    res.json({
      success: true,
      token,
      user: { id: admin._id, username: admin.username, role: 'admin' },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/lecturer/login
const lecturerLogin = async (req, res, next) => {
  try {
    const { lecturerId, surname } = req.body;

    if (!lecturerId || !surname) {
      return res.status(400).json({ success: false, message: 'Lecturer ID and surname are required.' });
    }

    const lecturer = await Lecturer.findOne({
      lecturerId,
      surname: surname.trim().toUpperCase(),
    });

    if (!lecturer) {
      return res.status(401).json({ success: false, message: 'Lecturer not found or invalid credentials.' });
    }

    const token = signToken({ id: lecturer._id, role: 'lecturer', lecturerId: lecturer.lecturerId });

    res.json({
      success: true,
      token,
      user: {
        id: lecturer._id,
        lecturerId: lecturer.lecturerId,
        name: `${lecturer.title || ''} ${lecturer.firstname} ${lecturer.surname}`.trim(),
        department: lecturer.department,
        role: 'lecturer',
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { adminLogin, lecturerLogin };
