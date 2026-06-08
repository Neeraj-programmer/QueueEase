import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Ticket, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard-stats');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // 30s polling
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return <div className="flex justify-center items-center h-[calc(100vh-64px)]">Loading admin dashboard...</div>;
  }

  const statCards = [
    { title: 'Total Tokens Today', value: stats.totalToday, icon: <Ticket className="text-blue-500" />, bg: 'bg-blue-50' },
    { title: 'Waiting', value: stats.waiting, icon: <Clock className="text-yellow-500" />, bg: 'bg-yellow-50' },
    { title: 'Currently Called', value: stats.called, icon: <Users className="text-purple-500" />, bg: 'bg-purple-50' },
    { title: 'Completed', value: stats.completed, icon: <CheckCircle className="text-green-500" />, bg: 'bg-green-50' },
    { title: 'Skipped', value: stats.skipped, icon: <AlertCircle className="text-orange-500" />, bg: 'bg-orange-50' },
    { title: 'Cancelled', value: stats.cancelled, icon: <XCircle className="text-red-500" />, bg: 'bg-red-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard - Today's Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center">
            <div className={`p-4 rounded-full ${stat.bg} mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
