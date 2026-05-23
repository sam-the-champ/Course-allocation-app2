const express = require('express');
const { adminLogin, lecturerLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/lecturer/login', lecturerLogin);

module.exports = router;
