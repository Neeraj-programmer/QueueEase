import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { ArrowLeft, RefreshCw, CheckCircle, SkipForward, Play } from 'lucide-react';

const DepartmentQueue = () => {
  const { departmentId } = useParams();
  const [tokens, setTokens] = useState([]);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchQueue = async () => {
    try {
      const [queueRes, deptRes] = await Promise.all([
        api.get(`/tokens/department/${departmentId}`),
        api.get(`/departments/${departmentId}`)
      ]);
      setTokens(queueRes.data);
      setDepartment(deptRes.data);
    } catch (error) {
      toast.error('Failed to load queue');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 20000); // 20s polling
    return () => clearInterval(interval);
  }, [departmentId]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchQueue();
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(`/tokens/${id}/${action}`);
      toast.success(`Token ${action}ed`);
      fetchQueue();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} token`);
    }
  };

  if (loading || !department) {
    return <div className="flex justify-center items-center h-64">Loading queue...</div>;
  }

  const waitingTokens = tokens.filter(t => t.status === 'Waiting');
  const calledToken = tokens.find(t => t.status === 'Called');
  const otherTokens = tokens.filter(t => ['Completed', 'Skipped', 'Cancelled'].includes(t.status));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to="/admin/departments" className="mr-4 text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{department.name} Queue</h1>
            <p className="text-gray-500">Manage today's tokens</p>
          </div>
        </div>
        <button 
          onClick={handleManualRefresh}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Currently Serving */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Currently Serving</h2>
          {calledToken ? (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 shadow-sm">
              <div className="text-center mb-6">
                <span className="text-sm font-medium text-primary-600 uppercase tracking-wider block mb-2">Token Number</span>
                <span className="text-5xl font-extrabold text-gray-900">{calledToken.tokenNumber}</span>
              </div>
              <div className="space-y-2 mb-6 text-sm text-gray-700">
                <p><strong>Type:</strong> <span className="uppercase text-xs font-bold bg-gray-100 px-2 py-1 rounded">{calledToken.userType}</span></p>
                {calledToken.userType === 'student' ? (
                  <>
                    <p><strong>Student:</strong> {calledToken.studentId?.name || 'N/A'}</p>
                    <p><strong>ID:</strong> {calledToken.studentId?.collegeId || 'N/A'}</p>
                  </>
                ) : (
                  <>
                    <p><strong>Visitor:</strong> {calledToken.visitorName || 'N/A'}</p>
                    <p><strong>Phone:</strong> {calledToken.visitorPhone || 'N/A'}</p>
                  </>
                )}
                <p><strong>Purpose:</strong> {calledToken.purpose}</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleAction(calledToken._id, 'complete')}
                  className="flex-1 flex items-center justify-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Complete
                </button>
                <button 
                  onClick={() => handleAction(calledToken._id, 'skip')}
                  className="flex-1 flex items-center justify-center bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-colors"
                >
                  <SkipForward className="w-4 h-4 mr-2" /> Skip
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
              No token is currently called.
            </div>
          )}

          {/* Controls */}
          {waitingTokens.length > 0 && !calledToken && (
            <button 
              onClick={() => handleAction(waitingTokens[0]._id, 'call')}
              className="w-full flex items-center justify-center py-4 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition-colors text-lg font-bold"
            >
              <Play className="w-6 h-6 mr-2" /> Call Next Token ({waitingTokens[0].tokenNumber})
            </button>
          )}
        </div>

        {/* Waiting & History */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Waiting ({waitingTokens.length})</h2>
            {waitingTokens.length > 0 ? (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wait Time</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {waitingTokens.map((token, idx) => (
                      <tr key={token._id}>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{token.tokenNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${token.userType === 'visitor' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {token.userType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {token.userType === 'student' ? (
                            <>{token.studentId?.name} <br/> <span className="text-xs">{token.studentId?.collegeId}</span></>
                          ) : (
                            <>{token.visitorName} <br/> <span className="text-xs">{token.visitorPhone}</span></>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{token.purpose}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Math.floor((new Date() - new Date(token.createdAt)) / 60000)} mins
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {idx === 0 && !calledToken && (
                             <button onClick={() => handleAction(token._id, 'call')} className="text-primary-600 hover:text-primary-900 font-bold">Call</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 py-4">No tokens waiting.</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">Completed / Past</h2>
            {otherTokens.length > 0 ? (
               <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
               <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                   <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Details</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                   {otherTokens.map((token) => (
                     <tr key={token._id}>
                       <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{token.tokenNumber}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${token.userType === 'visitor' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                           {token.userType}
                         </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {token.userType === 'student' ? token.studentId?.name : token.visitorName}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm">
                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                           token.status === 'Completed' ? 'bg-green-100 text-green-800' :
                           token.status === 'Skipped' ? 'bg-orange-100 text-orange-800' :
                           'bg-red-100 text-red-800'
                         }`}>
                           {token.status}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
            ) : (
              <p className="text-gray-500 py-4">No past tokens.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentQueue;
