import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Ticket, Clock, CheckCircle } from 'lucide-react';

const VisitorToken = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    visitorName: '',
    visitorPhone: '',
    departmentId: '',
    purpose: '',
    studentName: '',
    course: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      // Fetch departments from public route
      const response = await api.get('/departments');
      setDepartments(response.data);
    } catch (error) {
      toast.error('Failed to load departments');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/tokens/generate-visitor', formData);
      toast.success('Visitor Token generated successfully!');
      setGeneratedToken(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate token');
    } finally {
      setIsLoading(false);
    }
  };

  if (generatedToken) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Token Generated!</h2>
        <div className="bg-primary-50 p-6 rounded-lg mb-6 border border-primary-100">
          <p className="text-sm text-primary-600 font-semibold mb-1">YOUR TOKEN NUMBER</p>
          <p className="text-5xl font-black text-primary-700 tracking-wider">
            {generatedToken.tokenNumber}
          </p>
        </div>
        <button
          onClick={() => navigate(`/visitor-status/${generatedToken._id}`)}
          className="w-full bg-primary-600 text-white font-semibold py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Track Token Status
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-primary-600 px-6 py-8 text-center text-white">
          <Ticket className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold">Visitor Token</h2>
          <p className="mt-2 text-primary-100">Generate a queue token without an account</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Visitor Full Name</label>
              <input type="text" name="visitorName" required value={formData.visitorName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="tel" name="visitorPhone" required pattern="[0-9]{10}" maxLength="10" value={formData.visitorPhone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border" placeholder="10-digit number" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Department</label>
            <select name="departmentId" required value={formData.departmentId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border">
              <option value="">-- Choose Department --</option>
              {departments.filter(d => d.isActive).map(dept => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Purpose of Visit</label>
            <input type="text" name="purpose" required value={formData.purpose} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border" placeholder="e.g. Admission inquiry, meeting staff" />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Optional Student Details</h3>
            <p className="text-sm text-gray-500 mb-4">If you are visiting regarding a specific student, please provide their details.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Course / Branch</label>
                <input type="text" name="course" value={formData.course} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border" placeholder="e.g. CSE 2nd Year" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors">
            {isLoading ? 'Generating...' : 'Generate Token'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VisitorToken;
