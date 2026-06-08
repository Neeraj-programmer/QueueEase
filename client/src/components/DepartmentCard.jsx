import React from 'react';
import { Building2, Clock, Activity } from 'lucide-react';

const DepartmentCard = ({ department, onEdit, onDelete }) => {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{department.name}</h3>
          <p className="text-sm text-gray-500 mt-1">Code: <span className="font-semibold text-gray-700">{department.code}</span></p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${department.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
          {department.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          <span>Avg Service Time: <span className="font-medium">{department.averageServiceTime} min</span></span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Activity className="w-4 h-4 mr-2 text-gray-400" />
          <span>Created: {new Date(department.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => onEdit(department)}
          className="flex-1 bg-primary-50 text-primary-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-100 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(department._id)}
          className="flex-1 bg-red-50 text-red-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DepartmentCard;
