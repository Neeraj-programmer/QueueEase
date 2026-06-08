import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, GraduationCap, Phone, Hash } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        setProfile(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-primary-600 px-6 py-8">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-6 text-white">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-primary-100 mt-1 capitalize">{profile.role}</p>
            </div>
          </div>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="flex items-center text-gray-700 pb-4 border-b">
            <Mail className="w-5 h-5 text-gray-400 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium">{profile.email}</p>
            </div>
          </div>

          {profile.role === 'student' && (
            <>
              <div className="flex items-center text-gray-700 pb-4 border-b">
                <Hash className="w-5 h-5 text-gray-400 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">College ID</p>
                  <p className="font-medium">{profile.collegeId}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700 pb-4 border-b">
                <GraduationCap className="w-5 h-5 text-gray-400 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Branch & Year</p>
                  <p className="font-medium">{profile.branch} - Year {profile.year}</p>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center text-gray-700">
            <Phone className="w-5 h-5 text-gray-400 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{profile.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
