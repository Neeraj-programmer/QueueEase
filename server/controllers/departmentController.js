const Department = require('../models/Department');

// @desc    Create new department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = async (req, res) => {
  try {
    const { name, code, averageServiceTime } = req.body;

    const departmentExists = await Department.findOne({ $or: [{ name }, { code }] });
    if (departmentExists) {
      return res.status(400).json({ message: 'Department name or code already exists' });
    }

    const department = await Department.create({
      name,
      code,
      averageServiceTime
    });

    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public (so students can see active ones, admin can see all)
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Private/Admin
const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = async (req, res) => {
  try {
    const { name, code, averageServiceTime, isActive } = req.body;
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    department.name = name || department.name;
    department.code = code || department.code;
    department.averageServiceTime = averageServiceTime || department.averageServiceTime;
    if (isActive !== undefined) {
      department.isActive = isActive;
    }

    const updatedDepartment = await department.save();
    res.json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    await department.deleteOne();
    res.json({ message: 'Department removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment
};
