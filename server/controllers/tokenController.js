const Token = require('../models/Token');
const Department = require('../models/Department');

// Helper to get start and end of today
const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// @desc    Generate a new token
// @route   POST /api/tokens/generate
// @access  Private/Student
const generateToken = async (req, res) => {
  try {
    const { departmentId, purpose } = req.body;
    const studentId = req.user._id;

    // Check if department exists and is active
    const department = await Department.findById(departmentId);
    if (!department || !department.isActive) {
      return res.status(400).json({ message: 'Invalid or inactive department' });
    }

    // Check if student already has a waiting or called token
    const activeToken = await Token.findOne({
      studentId,
      status: { $in: ['Waiting', 'Called'] }
    });
    if (activeToken) {
      return res.status(400).json({ message: 'You already have an active token' });
    }

    const { start, end } = getTodayRange();

    // Count today's tokens for this department to generate sequence
    const todaysTokensCount = await Token.countDocuments({
      departmentId,
      queueDate: { $gte: start, $lte: end }
    });

    const sequence = todaysTokensCount + 1;
    // Format: EX-S-001
    const tokenNumber = `${department.code}-S-${sequence.toString().padStart(3, '0')}`;

    const token = await Token.create({
      tokenNumber,
      studentId,
      departmentId,
      purpose
    });

    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate a visitor token (Public)
// @route   POST /api/tokens/generate-visitor
// @access  Public
const generateVisitorToken = async (req, res) => {
  try {
    const { departmentId, purpose, visitorName, visitorPhone, studentName, course } = req.body;

    const department = await Department.findById(departmentId);
    if (!department || !department.isActive) {
      return res.status(400).json({ message: 'Invalid or inactive department' });
    }

    const { start, end } = getTodayRange();
    const todaysTokensCount = await Token.countDocuments({
      departmentId,
      queueDate: { $gte: start, $lte: end }
    });

    const sequence = todaysTokensCount + 1;
    // Format: EX-V-001
    const tokenNumber = `${department.code}-V-${sequence.toString().padStart(3, '0')}`;

    const token = await Token.create({
      tokenNumber,
      userType: 'visitor',
      departmentId,
      purpose,
      visitorPurpose: purpose,
      visitorName,
      visitorPhone,
      studentName,
      course
    });

    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's active token
// @route   GET /api/tokens/my-active-token
// @access  Private/Student
const getMyActiveToken = async (req, res) => {
  try {
    const activeToken = await Token.findOne({
      studentId: req.user._id,
      status: { $in: ['Waiting', 'Called'] }
    }).populate('departmentId', 'name code averageServiceTime');

    if (!activeToken) {
      return res.status(404).json({ message: 'No active token found' });
    }

    // If waiting, calculate estimated time and people before
    let peopleBefore = 0;
    let estimatedWaitTime = 0;

    if (activeToken.status === 'Waiting') {
      const { start, end } = getTodayRange();
      peopleBefore = await Token.countDocuments({
        departmentId: activeToken.departmentId._id,
        queueDate: { $gte: start, $lte: end },
        status: 'Waiting',
        createdAt: { $lt: activeToken.createdAt }
      });
      estimatedWaitTime = peopleBefore * activeToken.departmentId.averageServiceTime;
    }

    // Get current serving token for the department
    const { start, end } = getTodayRange();
    const currentServingToken = await Token.findOne({
      departmentId: activeToken.departmentId._id,
      queueDate: { $gte: start, $lte: end },
      status: 'Called'
    });

    res.json({
      token: activeToken,
      peopleBefore,
      estimatedWaitTime,
      currentServingToken: currentServingToken ? currentServingToken.tokenNumber : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's token history
// @route   GET /api/tokens/my-history
// @access  Private/Student
const getMyHistory = async (req, res) => {
  try {
    const tokens = await Token.find({
      studentId: req.user._id,
      status: { $in: ['Completed', 'Skipped', 'Cancelled'] }
    }).populate('departmentId', 'name').sort('-createdAt');
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get department's queue (today)
// @route   GET /api/tokens/department/:departmentId
// @access  Private/Admin
const getDepartmentQueue = async (req, res) => {
  try {
    const { start, end } = getTodayRange();
    const tokens = await Token.find({
      departmentId: req.params.departmentId,
      queueDate: { $gte: start, $lte: end }
    }).populate('studentId', 'name collegeId').sort('createdAt');
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get token status
// @route   GET /api/tokens/status/:tokenId
// @access  Public
const getTokenStatus = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    let query = {};
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.tokenId);
    if (isObjectId) {
      query = { _id: req.params.tokenId };
    } else {
      query = { tokenNumber: req.params.tokenId.toUpperCase() };
    }

    const token = await Token.findOne(query).populate('departmentId', 'name code averageServiceTime');
    if (!token) return res.status(404).json({ message: 'Token not found or invalid token number' });
    
    let peopleBefore = 0;
    let estimatedWaitTime = 0;

    if (token.status === 'Waiting') {
      const { start, end } = getTodayRange();
      peopleBefore = await Token.countDocuments({
        departmentId: token.departmentId._id,
        queueDate: { $gte: start, $lte: end },
        status: 'Waiting',
        createdAt: { $lt: token.createdAt }
      });
      estimatedWaitTime = peopleBefore * token.departmentId.averageServiceTime;
    }

    const { start, end } = getTodayRange();
    const currentServingToken = await Token.findOne({
      departmentId: token.departmentId._id,
      queueDate: { $gte: start, $lte: end },
      status: 'Called'
    });

    res.json({
      token,
      peopleBefore,
      estimatedWaitTime,
      currentServingToken: currentServingToken ? currentServingToken.tokenNumber : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin actions
// @desc    Call next token
// @route   PUT /api/tokens/:id/call
// @access  Private/Admin
const callToken = async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) return res.status(404).json({ message: 'Token not found' });
    
    // Check if any other token in the same department is currently 'Called'
    const { start, end } = getTodayRange();
    const currentlyCalled = await Token.findOne({
      departmentId: token.departmentId,
      queueDate: { $gte: start, $lte: end },
      status: 'Called'
    });

    if (currentlyCalled) {
      return res.status(400).json({ message: 'Another token is already called. Please complete or skip it first.' });
    }

    token.status = 'Called';
    token.calledAt = Date.now();
    await token.save();
    res.json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete token
// @route   PUT /api/tokens/:id/complete
// @access  Private/Admin
const completeToken = async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) return res.status(404).json({ message: 'Token not found' });
    
    token.status = 'Completed';
    token.completedAt = Date.now();
    await token.save();
    res.json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Skip token
// @route   PUT /api/tokens/:id/skip
// @access  Private/Admin
const skipToken = async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) return res.status(404).json({ message: 'Token not found' });
    
    token.status = 'Skipped';
    await token.save();
    res.json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel token (Student or Admin can cancel)
// @route   PUT /api/tokens/:id/cancel
// @access  Private
const cancelToken = async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) return res.status(404).json({ message: 'Token not found' });
    
    // Check ownership if student
    if (req.user.role === 'student' && token.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this token' });
    }

    token.status = 'Cancelled';
    await token.save();
    res.json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
