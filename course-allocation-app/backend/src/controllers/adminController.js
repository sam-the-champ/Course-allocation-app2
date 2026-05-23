const Lecturer = require('../models/Lecturer');
const Course = require('../models/Course');
const Allocation = require('../models/Allocation');

// POST /api/admin/lecturers
const addLecturer = async (req, res, next) => {
  try {
    const { lecturerId, surname, firstname, email, department, phoneNumber, gender, title } = req.body;

    const existing = await Lecturer.findOne({ lecturerId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Lecturer with this ID already exists.' });
    }

    const lecturer = await Lecturer.create({
      lecturerId,
      surname: surname.trim().toUpperCase(),
      firstname: firstname.trim(),
      email,
      department,
      phoneNumber,
      gender,
      title,
    });

    res.status(201).json({ success: true, message: 'Lecturer added successfully.', data: lecturer });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/lecturers
const getLecturers = async (req, res, next) => {
  try {
    const lecturers = await Lecturer.find().sort({ surname: 1 });
    res.json({ success: true, count: lecturers.length, data: lecturers });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/lecturers/:id
const deleteLecturer = async (req, res, next) => {
  try {
    const lecturer = await Lecturer.findByIdAndDelete(req.params.id);
    if (!lecturer) return res.status(404).json({ success: false, message: 'Lecturer not found.' });

    // Remove all allocations for this lecturer too
    await Allocation.deleteMany({ lecturer: req.params.id });

    res.json({ success: true, message: 'Lecturer and their allocations removed.' });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/courses
const addCourse = async (req, res, next) => {
  try {
    const { courseCode, courseTitle, semester, unit, description } = req.body;

    if (!courseCode || !courseTitle || !semester || !unit) {
      return res.status(400).json({ success: false, message: 'courseCode, courseTitle, semester, and unit are required.' });
    }

    const course = await Course.create({ courseCode, courseTitle, semester, unit, description });
    res.status(201).json({ success: true, message: 'Course added successfully.', data: course });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/courses
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ courseCode: 1 });
    res.json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/courses/:id
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });

    await Allocation.deleteMany({ course: req.params.id });
    res.json({ success: true, message: 'Course and its allocations removed.' });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/allocations
const allocateCourse = async (req, res, next) => {
  try {
    const { lecturerId, courseId, level, semester, classDate, classTime, academicSession } = req.body;

    const lecturer = await Lecturer.findById(lecturerId);
    if (!lecturer) return res.status(404).json({ success: false, message: 'Lecturer not found.' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });

    const allocation = await Allocation.create({
      lecturer: lecturerId,
      course: courseId,
      level,
      semester,
      classDate,
      classTime,
      academicSession,
    });

    await allocation.populate(['lecturer', 'course']);

    res.status(201).json({ success: true, message: 'Course allocated successfully.', data: allocation });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'This course is already allocated to this lecturer for the specified level, semester, and session.' });
    }
    next(err);
  }
};

// GET /api/admin/allocations
const getAllocations = async (req, res, next) => {
  try {
    const allocations = await Allocation.find()
      .populate('lecturer', 'lecturerId firstname surname department title')
      .populate('course', 'courseCode courseTitle unit semester')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: allocations.length, data: allocations });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/allocations/:id
const deleteAllocation = async (req, res, next) => {
  try {
    const allocation = await Allocation.findByIdAndDelete(req.params.id);
    if (!allocation) return res.status(404).json({ success: false, message: 'Allocation not found.' });
    res.json({ success: true, message: 'Allocation removed.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalLecturers, totalCourses, totalAllocations] = await Promise.all([
      Lecturer.countDocuments(),
      Course.countDocuments(),
      Allocation.countDocuments(),
    ]);

    // Count unique courses that have at least one allocation
    const allocatedCourseIds = await Allocation.distinct('course');
    const allocatedCourses = allocatedCourseIds.length;
    const unallocatedCourses = totalCourses - allocatedCourses;

    res.json({
      success: true,
      data: { totalLecturers, totalCourses, totalAllocations, allocatedCourses, unallocatedCourses },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addLecturer, getLecturers, deleteLecturer,
  addCourse, getCourses, deleteCourse,
  allocateCourse, getAllocations, deleteAllocation,
  getDashboardStats,
};
