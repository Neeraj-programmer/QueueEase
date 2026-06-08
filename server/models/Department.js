const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a department name'],
    unique: true
  },
  code: {
    type: String,
    required: [true, 'Please add a department code'],
    unique: true,
    uppercase: true
  },
  averageServiceTime: {
    type: Number,
    required: [true, 'Please add average service time in minutes'],
    default: 5
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);
