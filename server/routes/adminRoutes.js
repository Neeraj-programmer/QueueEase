const express = require('express');
const router = express.Router();
const { getDashboardStats, getTodayTokens, getUsers, createStaff } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/today-tokens', getTodayTokens);
router.get('/users', getUsers);
router.post('/create-staff', createStaff);

module.exports = router;
