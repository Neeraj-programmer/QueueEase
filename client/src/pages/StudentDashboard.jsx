import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TokenCard from '../components/TokenCard';
import { RefreshCw, PlusCircle, AlertCircle } from 'lucide-react';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchActiveToken = async () => {
    try {
      const res = await api.get('/tokens/my-active-token');
      setData(res.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setData(null); // No active token
      } else {
        setError('Failed to fetch token status');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActiveToken();

    // Polling every 20 seconds
    const interval = setInterval(() => {
      fetchActiveToken();
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchActiveToken();
  };

  const handleCancelToken = async () => {
    if (window.confirm('Are you sure you want to cancel your token?')) {
      try {
        await api.put(`/tokens/${data.token._id}/cancel`);
        fetchActiveToken();
      } catch (err) {
        alert('Failed to cancel token');
      }
    }
  };

  if (loading && !data) {
    return <div className="flex justify-center items-center h-[calc(100vh-64px)]">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <button 
          onClick={handleManualRefresh}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 bg-white border border-gray-300 rounded-md px-3 py-2 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Your Active Token</h2>
              <TokenCard token={data.token} isServing={data.token.status === 'Called'} />
              
              {data.token.status === 'Waiting' && (
                <button 
                  onClick={handleCancelToken}
                  className="mt-4 w-full py-2 border border-red-300 text-red-600 font-medium rounded-md hover:bg-red-50 transition-colors"
                >
                  Cancel Token
                </button>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Queue Status Card */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Queue Status</h3>
                
                {data.token.status === 'Waiting' ? (
                  <>
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="text-gray-600">Currently Serving</span>
                      <span className="text-xl font-bold text-gray-900">{data.currentServingToken || 'None'}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b">
                      <span className="text-gray-600">People Before You</span>
                      <span className="text-xl font-bold text-gray-900">{data.peopleBefore}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-gray-600">Estimated Wait</span>
                      <span className="text-xl font-bold text-primary-600">{data.estimatedWaitTime} min</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 animate-bounce">
                      <span className="text-3xl">👋</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">It's your turn!</h3>
                    <p className="text-gray-600 mt-2">Please proceed to {data.token.departmentId.name}.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Ticket className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Active Token</h2>
          <p className="text-gray-500 mb-6">You don't have any waiting or called tokens right now.</p>
          <Link 
            to="/generate-token" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Generate Token
          </Link>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

// Local Ticket icon since it might not be imported above
const Ticket = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2" />
    <path d="M13 17v2" />
    <path d="M13 11v2" />
  </svg>
)
