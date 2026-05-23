const Lecturer = require('../models/Lecturer');
const Allocation = require('../models/Allocation');

// GET /api/lecturer/me  (uses JWT id)
const getMyProfile = async (req, res, next) => {
  try {
    const lecturer = await Lecturer.findById(req.user.id).select('-__v');
    if (!lecturer) return res.status(404).json({ success: false, message: 'Lecturer not found.' });

    res.json({ success: true, data: lecturer });
  } catch (err) {
    next(err);
  }
};

// GET /api/lecturer/my-allocations  (uses JWT id)
const getMyAllocations = async (req, res, next) => {
  try {
    const allocations = await Allocation.find({ lecturer: req.user.id })
      .populate('course', 'courseCode courseTitle unit semester description')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: allocations.length, data: allocations });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyProfile, getMyAllocations };
