import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TokenCard from '../components/TokenCard';

const MyTokenHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/tokens/my-history');
        setHistory(res.data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading history...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My History</h1>
      
      {history.length === 0 ? (
        <div className="bg-white p-8 border border-gray-200 rounded-lg text-center text-gray-500 shadow-sm">
          You haven't generated any tokens yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((token) => (
            <TokenCard key={token._id} token={token} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTokenHistory;
