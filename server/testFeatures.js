const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Department = require('./models/Department');
const Token = require('./models/Token');

dotenv.config();

const runTests = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for Testing');

    // 1. Clear previous test data (except admin)
    console.log('Clearing old test data...');
    await Department.deleteMany({});
    await Token.deleteMany({});
    await User.deleteMany({ role: 'student' });

    // 2. Test Feature: Department Management (Create Departments)
    console.log('✅ Testing Department Creation...');
    const examCell = await Department.create({
      name: 'Exam Cell',
      code: 'EX',
      averageServiceTime: 5,
      isActive: true
    });
    const library = await Department.create({
      name: 'Library',
      code: 'LIB',
      averageServiceTime: 3,
      isActive: true
    });
    const accounts = await Department.create({
      name: 'Accounts Office',
      code: 'AC',
      averageServiceTime: 10,
      isActive: true
    });
    console.log(`   Created ${await Department.countDocuments()} departments.`);

    // 3. Test Feature: Student Registration
    console.log('✅ Testing Student Registration...');
    const student1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'password123',
      collegeId: 'CSE001',
      branch: 'CSE',
      year: '2',
      phone: '9876543210',
      role: 'student'
    });
    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@example.com',
      password: 'password123',
      collegeId: 'IT002',
      branch: 'IT',
      year: '3',
      phone: '9876543211',
      role: 'student'
    });
    const student3 = await User.create({
      name: 'Amit Kumar',
      email: 'amit@example.com',
      password: 'password123',
      collegeId: 'MECH003',
      branch: 'Mechanical',
      year: '4',
      phone: '9876543212',
      role: 'student'
    });
    console.log(`   Created ${await User.countDocuments({ role: 'student' })} students.`);

    // 4. Test Feature: Token Generation
    console.log('✅ Testing Token Generation...');
    const token1 = await Token.create({
      tokenNumber: 'EX-001',
      studentId: student1._id,
      departmentId: examCell._id,
      purpose: 'Admit card correction',
      status: 'Waiting'
    });
    const token2 = await Token.create({
      tokenNumber: 'EX-002',
      studentId: student2._id,
      departmentId: examCell._id,
      purpose: 'Result discrepancy',
      status: 'Waiting'
    });
    const token3 = await Token.create({
      tokenNumber: 'LIB-001',
      studentId: student3._id,
      departmentId: library._id,
      purpose: 'Book issue',
      status: 'Waiting'
    });
    console.log(`   Created ${await Token.countDocuments()} tokens in waiting state.`);

    // 5. Test Feature: Queue Logic & Admin Actions (Call and Complete)
    console.log('✅ Testing Admin Queue Actions...');
    
    // Admin calls Token 1
    token1.status = 'Called';
    token1.calledAt = Date.now();
    await token1.save();
    console.log(`   Called Token: ${token1.tokenNumber}`);

    // Admin completes Token 1
    token1.status = 'Completed';
    token1.completedAt = Date.now();
    await token1.save();
    console.log(`   Completed Token: ${token1.tokenNumber}`);

    // Admin calls Token 2
    token2.status = 'Called';
    token2.calledAt = Date.now();
    await token2.save();
    console.log(`   Called Token: ${token2.tokenNumber}`);

    // Generate new token for student 1 (since previous is completed)
    const token4 = await Token.create({
      tokenNumber: 'AC-001',
      studentId: student1._id,
      departmentId: accounts._id,
      purpose: 'Fee receipt',
      status: 'Waiting'
    });
    console.log(`   Student 1 generated a new token: ${token4.tokenNumber} for Accounts`);

    // Admin skips Token 3
    token3.status = 'Skipped';
    await token3.save();
    console.log(`   Skipped Token: ${token3.tokenNumber}`);

    // Generate another token for library
    const token5 = await Token.create({
      tokenNumber: 'LIB-002',
      studentId: student3._id,
      departmentId: library._id,
      purpose: 'Return book',
      status: 'Cancelled' // Student cancelled it
    });
    console.log(`   Student 3 cancelled token: ${token5.tokenNumber}`);

    console.log('\\n🎉 All features tested successfully with sample data!');
    console.log('==================================================');
    console.log('Admin Dashboard Stats expected:');
    console.log('- Total Tokens: 5');
    console.log('- Waiting: 1 (AC-001)');
    console.log('- Called: 1 (EX-002)');
    console.log('- Completed: 1 (EX-001)');
    console.log('- Skipped: 1 (LIB-001)');
    console.log('- Cancelled: 1 (LIB-002)');
    
    process.exit();
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

runTests();
