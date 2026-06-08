import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Ticket, AlertCircle } from 'lucide-react';

const GenerateToken = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    departmentId: '',
    purpose: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        // Only show active departments
        setDepartments(res.data.filter(dep => dep.isActive));
      } catch (error) {
        toast.error('Failed to load departments');
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.departmentId) {
      toast.warning('Please select a department');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post('/tokens/generate', formData);
      toast.success('Token generated successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate token');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading departments...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-primary-600 px-6 py-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
            <Ticket className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Generate New Token</h1>
          <p className="text-primary-100 mt-2">Select a department and mention your purpose to join the queue.</p>
        </div>
        
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Department</label>
              {departments.length === 0 ? (
                <div className="flex items-center p-4 bg-yellow-50 text-yellow-800 rounded-md">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  No active departments available at the moment.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {departments.map((dept) => (
                    <div 
                      key={dept._id}
                      onClick={() => setFormData({ ...formData, departmentId: dept._id })}
                      className={`cursor-pointer border rounded-lg p-4 transition-all ${formData.departmentId === dept._id ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-primary-300'}`}
                    >
                      <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Avg Wait: {dept.averageServiceTime} mins</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Visit</label>
              <textarea
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. Admit card correction, Fee payment query..."
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              ></textarea>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || departments.length === 0 || !formData.departmentId}
                className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${isSubmitting || departments.length === 0 || !formData.departmentId ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Generating...' : 'Confirm & Join Queue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateToken;
