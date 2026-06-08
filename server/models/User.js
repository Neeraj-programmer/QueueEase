const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  collegeId: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  branch: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  year: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    match: [
      /^[0-9]{10}$/,
      'Please enter a valid 10-digit phone number'
    ]
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
