const API_URL = 'http://localhost:5000/api';
let adminToken = '';
let staffToken = '';
let studentToken = '';
let departmentId = '';
let studentTokenId = '';
let visitorTokenId = '';

async function fetchAPI(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });
  
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'API Error');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function runTests() {
  console.log('🚀 Starting Automated Feature Testing with Sample Data...\n');

  try {
    // 1. Super Admin Login
    console.log('⏳ 1. Testing Super Admin Login...');
    const adminData = await fetchAPI('/auth/login', 'POST', {
      email: 'admin@queueease.com',
      password: 'password123'
    });
    adminToken = adminData.token;
    console.log('✅ Super Admin Logged In Successfully!\n');

    // 2. Create or Fetch Department
    console.log('⏳ 2. Testing Department Creation...');
    try {
      const deptData = await fetchAPI('/departments', 'POST', {
        name: 'Test Verification Cell',
        code: 'TVC',
        description: 'Temporary cell for testing',
        averageServiceTime: 5
      }, adminToken);
      departmentId = deptData._id;
      console.log(`✅ Department Created: ${deptData.name} (${deptData.code})\n`);
    } catch (e) {
      if (e.status === 400 && e.data.message === 'Department name or code already exists') {
        console.log('✅ Department already exists. Fetching it...');
        const allDepts = await fetchAPI('/departments');
        const dept = allDepts.find(d => d.code === 'TVC');
        departmentId = dept._id;
      } else {
        throw e;
      }
    }

    // 3. Create Staff Member
    console.log('⏳ 3. Testing Staff Creation (Manage Staff)...');
    try {
      await fetchAPI('/admin/create-staff', 'POST', {
        name: 'Staff Manager',
        email: 'staff@test.com',
        password: 'password123',
        phone: '9876543210'
      }, adminToken);
      console.log('✅ Staff Created: staff@test.com\n');
    } catch (e) {
      if (e.status === 400 && e.data.message === 'User already exists') {
        console.log('✅ Staff already exists. Continuing...\n');
      } else {
        throw e;
      }
    }

    // 4. Staff Login
    console.log('⏳ 4. Testing Staff Login...');
    const staffData = await fetchAPI('/auth/login', 'POST', {
      email: 'staff@test.com',
      password: 'password123'
    });
    staffToken = staffData.token;
    console.log('✅ Staff Logged In Successfully!\n');

    // 5. Student Registration
    console.log('⏳ 5. Testing Student Registration...');
    try {
      const studentData = await fetchAPI('/auth/register', 'POST', {
        name: 'Demo Student',
        email: 'demo@student.com',
        password: 'password123',
        collegeId: 'STU101',
        branch: 'CSE',
        year: '2',
        phone: '1234567890'
      });
      studentToken = studentData.token;
      console.log('✅ Student Registered Successfully!\n');
    } catch (e) {
      if (e.status === 400) {
        console.log('✅ Student already registered. Logging in...');
        const loginData = await fetchAPI('/auth/login', 'POST', {
          email: 'demo@student.com',
          password: 'password123'
        });
        studentToken = loginData.token;
      } else {
        throw e;
      }
    }

    // 6. Generate Student Token
    console.log('⏳ 6. Testing Student Token Generation...');
    try {
      const myActive = await fetchAPI('/tokens/my-active-token', 'GET', null, studentToken);
      if (myActive.token) {
        await fetchAPI(`/tokens/${myActive.token._id}/cancel`, 'PUT', null, studentToken);
      }
    } catch(e) {}
    
    const sTokenData = await fetchAPI('/tokens/generate', 'POST', {
      departmentId,
      purpose: 'Fee Submission'
    }, studentToken);
    studentTokenId = sTokenData._id;
    console.log(`✅ Student Token Generated: ${sTokenData.tokenNumber}\n`);

    // 7. Generate Visitor Token (Public API)
    console.log('⏳ 7. Testing Public Visitor Token Generation...');
    const vTokenData = await fetchAPI('/tokens/generate-visitor', 'POST', {
      departmentId,
      purpose: 'Meeting Principal',
      visitorName: 'Mr. Sharma',
      visitorPhone: '9988776655'
    });
    visitorTokenId = vTokenData._id;
    console.log(`✅ Visitor Token Generated: ${vTokenData.tokenNumber}\n`);

    // 8. View Unified Queue as Staff
    console.log('⏳ 8. Testing Unified Department Queue...');
    const queueData = await fetchAPI(`/tokens/department/${departmentId}`, 'GET', null, staffToken);
    console.log(`✅ Queue Fetched! Found ${queueData.length} tokens.`);
    queueData.forEach((t, i) => {
      console.log(`   - ${i+1}. [${t.userType.toUpperCase()}] ${t.tokenNumber} - ${t.purpose}`);
    });
    console.log();

    // 9. Call First Token
    console.log('⏳ 9. Testing "Call Next Token" Action...');
    await fetchAPI(`/tokens/${studentTokenId}/call`, 'PUT', null, staffToken);
    console.log(`✅ Token ${sTokenData.tokenNumber} has been Called to the counter!\n`);

    // 10. Check Visitor Status
    console.log('⏳ 10. Testing Public Live Status for Visitor...');
    const statusData = await fetchAPI(`/tokens/status/${vTokenData.tokenNumber}`, 'GET');
    console.log(`✅ Visitor Status: ${statusData.token.status}`);
    console.log(`   People Before Visitor: ${statusData.peopleBefore}`);
    console.log(`   Estimated Wait: ${statusData.estimatedWaitTime} mins\n`);

    // 11. Complete First Token & Call Visitor
    console.log('⏳ 11. Testing Token Completion & Visitor Call...');
    await fetchAPI(`/tokens/${studentTokenId}/complete`, 'PUT', null, staffToken);
    await fetchAPI(`/tokens/${visitorTokenId}/call`, 'PUT', null, staffToken);
    console.log(`✅ Token ${sTokenData.tokenNumber} Completed.`);
    console.log(`✅ Token ${vTokenData.tokenNumber} (Visitor) is now Called!\n`);

    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! The QueueEase ecosystem is running perfectly.');

  } catch (error) {
    console.error('❌ Error during testing:', error.data || error.message);
  }
}

runTests();
