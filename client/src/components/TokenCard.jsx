import React from 'react';
import { Clock, Hash, Building2, User } from 'lucide-react';

const TokenCard = ({ token, isServing = false }) => {
  const statusColors = {
    Waiting: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Called: 'bg-green-100 text-green-800 border-green-200 animate-pulse',
    Completed: 'bg-gray-100 text-gray-800 border-gray-200',
    Skipped: 'bg-orange-100 text-orange-800 border-orange-200',
    Cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className={`border rounded-lg p-6 shadow-sm ${isServing ? 'bg-primary-50 border-primary-200' : 'bg-white'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">Token Number</span>
          <h3 className={`text-3xl font-bold ${isServing ? 'text-primary-600' : 'text-gray-900'}`}>
            {token.tokenNumber}
          </h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[token.status]}`}>
          {token.status}
        </span>
      </div>

      <div className="space-y-3 mt-6">
        {token.departmentId && (
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium mr-1">Department:</span> 
            {token.departmentId.name}
          </div>
        )}
        
        {token.purpose && (
          <div className="flex items-center text-sm text-gray-600">
            <Hash className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium mr-1">Purpose:</span> 
            {token.purpose}
          </div>
        )}

        {token.studentId && typeof token.studentId === 'object' && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium mr-1">Student:</span> 
            {token.studentId.name} ({token.studentId.collegeId})
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium mr-1">Generated:</span> 
          {new Date(token.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
