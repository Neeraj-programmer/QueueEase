const Token = require('../models/Token');
const User = require('../models/User');

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const { start, end } = getTodayRange();
    
    // Todays tokens
    const todayTokens = await Token.find({ queueDate: { $gte: start, $lte: end } });
    
    const totalToday = todayTokens.length;
    const waiting = todayTokens.filter(t => t.status === 'Waiting').length;
    const called = todayTokens.filter(t => t.status === 'Called').length;
    const completed = todayTokens.filter(t => t.status === 'Completed').length;
    const skipped = todayTokens.filter(t => t.status === 'Skipped').length;
    const cancelled = todayTokens.filter(t => t.status === 'Cancelled').length;

    res.json({
      totalToday,
      waiting,
      called,
      completed,
      skipped,
      cancelled
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all today's tokens
// @route   GET /api/admin/today-tokens
// @access  Private/Admin
const getTodayTokens = async (req, res) => {
  try {
    const { start, end } = getTodayRange();
    const tokens = await Token.find({ queueDate: { $gte: start, $lte: end } })
      .populate('departmentId', 'name code')
      .populate('studentId', 'name collegeId')
      .sort('-createdAt');
      
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get users (students)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new staff
// @route   POST /api/admin/create-staff
// @access  Private/Admin
const createStaff = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const staff = await User.create({
      name,
      email,
      password,
      phone,
      role: 'admin'
    });

    res.status(201).json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  createStaff,
  getTodayTokens,
  getUsers
};
