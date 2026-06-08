const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  tokenNumber: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['student', 'visitor'],
    default: 'student'
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  visitorName: {
    type: String,
    required: false
  },
  visitorPhone: {
    type: String,
    required: false
  },
  visitorPurpose: {
    type: String,
    required: false
  },
  studentName: {
    type: String,
    required: false
  },
  course: {
    type: String,
    required: false
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  purpose: {
    type: String,
    required: [true, 'Please specify the purpose of visit']
  },
  status: {
    type: String,
    enum: ['Waiting', 'Called', 'Completed', 'Skipped', 'Cancelled'],
    default: 'Waiting'
  },
  queueDate: {
    type: Date,
    default: Date.now
  },
  calledAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Token', tokenSchema);
