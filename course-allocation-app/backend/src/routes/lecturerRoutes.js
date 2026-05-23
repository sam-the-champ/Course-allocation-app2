const express = require('express');
const { protect, lecturerOnly } = require('../middleware/authMiddleware');
const { getMyProfile, getMyAllocations } = require('../controllers/lecturerController');

const router = express.Router();

router.use(protect, lecturerOnly);

router.get('/me', getMyProfile);
router.get('/my-allocations', getMyAllocations);

module.exports = router;
