import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { RefreshCw, Users, Clock, Home, History } from 'lucide-react';

const VisitorStatus = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const [statusData, setStatusData] = useState(null);
  const [isLoading, setIsLoading] = useState(tokenId !== 'check');
  const [error, setError] = useState('');
  const [inputToken, setInputToken] = useState('');

  const fetchStatus = async () => {
    if (tokenId === 'check') return;
    try {
      const response = await api.get(`/tokens/status/${tokenId}`);
      setStatusData(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tokenId !== 'check') {
      setIsLoading(true);
      fetchStatus();
      // Refresh status every 30 seconds
      const interval = setInterval(fetchStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [tokenId]);

  if (tokenId === 'check') {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg border border-gray-200 text-center">
        <History className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Token Status</h2>
        <p className="text-gray-500 mb-6">Enter your token number to see your live wait time.</p>
        <form onSubmit={(e) => { e.preventDefault(); navigate(`/visitor-status/${inputToken.trim()}`); }}>
          <input 
            type="text" 
            placeholder="e.g. ADM-V-001" 
            className="w-full text-center text-lg uppercase tracking-wider rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-4 py-3 border mb-4" 
            value={inputToken} 
            onChange={(e) => setInputToken(e.target.value)} 
            required 
          />
          <button type="submit" className="w-full bg-primary-600 text-white font-semibold py-3 rounded-lg hover:bg-primary-700 transition-colors">
            Check Status
          </button>
        </form>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex justify-center mt-20"><RefreshCw className="w-8 h-8 text-primary-500 animate-spin" /></div>;
  }

  if (error || !statusData) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>
        <Link to="/visitor-token" className="text-primary-600 hover:underline">Generate a new token</Link>
      </div>
    );
  }

  const { token, peopleBefore, estimatedWaitTime, currentServingToken } = statusData;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Waiting': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Called': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Skipped': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-6 text-center relative">
          <Link to="/" className="absolute left-6 top-6 text-gray-400 hover:text-gray-600 transition-colors">
            <Home className="w-6 h-6" />
          </Link>
          <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Token Status</p>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">{token.tokenNumber}</h2>
          <div className="mt-4 flex justify-center">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(token.status)}`}>
              {token.status}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Department</p>
              <p className="font-semibold text-gray-900">{token.departmentId.name}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Currently Serving</p>
              <p className="font-semibold text-gray-900">{currentServingToken || 'None'}</p>
            </div>
          </div>

          {token.status === 'Waiting' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 bg-primary-50 rounded-xl border border-primary-100">
                <Users className="w-6 h-6 text-primary-600 mb-2" />
                <span className="text-3xl font-bold text-primary-700">{peopleBefore}</span>
                <span className="text-xs text-primary-600 mt-1 uppercase font-semibold">People Before You</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-primary-50 rounded-xl border border-primary-100">
                <Clock className="w-6 h-6 text-primary-600 mb-2" />
                <span className="text-3xl font-bold text-primary-700">{estimatedWaitTime}</span>
                <span className="text-xs text-primary-600 mt-1 uppercase font-semibold">Mins Est. Wait</span>
              </div>
            </div>
          )}

          {token.status === 'Called' && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-xl text-center">
              <h3 className="text-lg font-bold mb-2">It's Your Turn!</h3>
              <p>Please proceed to the {token.departmentId.name} counter immediately.</p>
            </div>
          )}

          <div className="pt-6 text-center">
            <button
              onClick={fetchStatus}
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorStatus;
