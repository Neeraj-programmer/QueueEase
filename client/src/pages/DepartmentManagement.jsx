import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import DepartmentCard from '../components/DepartmentCard';
import { PlusCircle, X, Users } from 'lucide-react';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    averageServiceTime: 5,
    isActive: true
  });

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data);
    } catch (error) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openModal = (dept = null) => {
    if (dept) {
      setEditingId(dept._id);
      setFormData({
        name: dept.name,
        code: dept.code,
        averageServiceTime: dept.averageServiceTime,
        isActive: dept.isActive
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', code: '', averageServiceTime: 5, isActive: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/departments/${editingId}`, formData);
        toast.success('Department updated');
      } else {
        await api.post('/departments', formData);
        toast.success('Department created');
      }
      closeModal();
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save department');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await api.delete(`/departments/${id}`);
        toast.success('Department deleted');
        fetchDepartments();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Departments</h1>
        <button 
          onClick={() => openModal()}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Department
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading departments...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div key={dept._id} className="relative">
              <DepartmentCard 
                department={dept} 
                onEdit={openModal} 
                onDelete={handleDelete} 
              />
              <Link 
                to={`/admin/queue/${dept._id}`}
                className="absolute top-4 right-4 flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 bg-primary-50 px-2 py-1 rounded"
              >
                <Users className="w-4 h-4 mr-1" /> View Queue
              </Link>
            </div>
          ))}
          {departments.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 border-dashed">
              No departments found. Click "Add Department" to create one.
            </div>
          )}
        </div>
      )}

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Department' : 'Add Department'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" required 
                  className="w-full px-3 py-2 border rounded-md" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Exam Cell"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input 
                  type="text" required 
                  className="w-full px-3 py-2 border rounded-md uppercase" 
                  value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})}
                  placeholder="e.g. EX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avg Service Time (mins)</label>
                <input 
                  type="number" required min="1"
                  className="w-full px-3 py-2 border rounded-md" 
                  value={formData.averageServiceTime} onChange={e => setFormData({...formData, averageServiceTime: e.target.value})}
                />
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" id="isActive"
                  className="h-4 w-4 text-primary-600 rounded border-gray-300"
                  checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})}
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Active Status</label>
              </div>
              
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
