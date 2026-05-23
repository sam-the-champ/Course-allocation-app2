const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  addLecturer, getLecturers, deleteLecturer,
  addCourse, getCourses, deleteCourse,
  allocateCourse, getAllocations, deleteAllocation,
  getDashboardStats,
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require a valid JWT with role=admin
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);

router.route('/lecturers').get(getLecturers).post(addLecturer);
router.delete('/lecturers/:id', deleteLecturer);

router.route('/courses').get(getCourses).post(addCourse);
router.delete('/courses/:id', deleteCourse);

router.route('/allocations').get(getAllocations).post(allocateCourse);
router.delete('/allocations/:id', deleteAllocation);

module.exports = router;
