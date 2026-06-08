import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import GenerateToken from './pages/GenerateToken';
import MyTokenHistory from './pages/MyTokenHistory';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import DepartmentManagement from './pages/DepartmentManagement';
import DepartmentQueue from './pages/DepartmentQueue';
import StaffManagement from './pages/StaffManagement';
import VisitorToken from './pages/VisitorToken';
import VisitorStatus from './pages/VisitorStatus';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/visitor-token" element={<VisitorToken />} />
            <Route path="/visitor-status/:tokenId" element={<VisitorStatus />} />
            
            {/* Student Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/generate-token" element={<ProtectedRoute><GenerateToken /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><MyTokenHistory /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/departments" element={<AdminRoute><DepartmentManagement /></AdminRoute>} />
            <Route path="/admin/staff" element={<AdminRoute><StaffManagement /></AdminRoute>} />
            <Route path="/admin/queue/:departmentId" element={<AdminRoute><DepartmentQueue /></AdminRoute>} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
