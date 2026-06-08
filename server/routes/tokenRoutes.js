const express = require('express');
const router = express.Router();
const {
  generateToken,
  generateVisitorToken,
  getMyActiveToken,
  getMyHistory,
  getDepartmentQueue,
  getTokenStatus,
  callToken,
  completeToken,
  skipToken,
  cancelToken
} = require('../controllers/tokenController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public visitor routes
router.post('/generate-visitor', generateVisitorToken);
router.get('/status/:tokenId', getTokenStatus);

// Student routes
router.post('/generate', protect, authorize('student'), generateToken);
router.get('/my-active-token', protect, authorize('student'), getMyActiveToken);
router.get('/my-history', protect, authorize('student'), getMyHistory);

// Shared route (Student/Admin can cancel their own)
router.put('/:id/cancel', protect, cancelToken);

// Admin routes
router.get('/department/:departmentId', protect, authorize('admin'), getDepartmentQueue);
router.put('/:id/call', protect, authorize('admin'), callToken);
router.put('/:id/complete', protect, authorize('admin'), completeToken);
router.put('/:id/skip', protect, authorize('admin'), skipToken);

module.exports = router;
