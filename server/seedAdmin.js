const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const adminExists = await User.findOne({ email: 'admin@queueease.com' });

    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@queueease.com',
      password: 'password123', // Will be hashed by pre-save hook
      phone: '1234567890',
      role: 'admin'
    });

    console.log('Admin user created successfully');
    console.log('Email: admin@queueease.com');
    console.log('Password: password123');
    process.exit();
  } catch (error) {
    console.error('Error with seed script:', error);
    process.exit(1);
  }
};

createAdmin();
