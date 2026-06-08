import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';

const StaffManagement = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/create-staff', formData);
      toast.success('Staff/Admin account created successfully!');
      setFormData({ name: '', email: '', password: '', phone: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create staff account');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Staff</h1>
      
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-full mr-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create New Staff Admin</h2>
            <p className="text-gray-500 text-sm">Add a new admin account to manage departments.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                name="name" type="text" required 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
                value={formData.name} onChange={handleChange} 
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input 
                name="email" type="email" required 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
                value={formData.email} onChange={handleChange} 
                placeholder="staff@college.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                name="password" type="password" required minLength="6"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
                value={formData.password} onChange={handleChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input 
                name="phone" type="text" required 
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
                value={formData.phone} onChange={handleChange} 
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create Staff Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffManagement;
