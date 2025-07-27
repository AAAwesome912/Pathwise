import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { Edit3 } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
    const navigate = useNavigate();
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Profile</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-6">
            <span className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-blue-500 ring-4 ring-blue-200">
                <span className="text-4xl font-medium leading-none text-white">{user?.email ? user.email.substring(0,1).toUpperCase() : 'U'}</span>
            </span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address:</label>
          <p className="mt-1 text-md text-gray-800 bg-gray-100 p-3 rounded-md">{user?.email || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role:</label>
          <p className="mt-1 text-md text-gray-800 bg-gray-100 p-3 rounded-md capitalize">{user?.role || 'N/A'}</p>
        </div>
        {user?.role === 'student' && user?.studentId && ( // Assuming studentId might be stored in user object after login/registration
          <div>
            <label className="block text-sm font-medium text-gray-700">Student ID:</label>
            <p className="mt-1 text-md text-gray-800 bg-gray-100 p-3 rounded-md">{user.studentId}</p>
          </div>
        )}
         {user?.role === 'staff' && user?.staffId && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Staff ID:</label>
            <p className="mt-1 text-md text-gray-800 bg-gray-100 p-3 rounded-md">{user.staffId}</p>
          </div>
        )}
        {/* Add more profile update fields and logic here as needed */}
        <div className="pt-4">
            <button type="button" className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Edit3 size={16} className="mr-2" /> Edit Profile 
            </button>
        </div>
      </div>
      <button onClick={() => navigate('/Dashboard')} className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150">
                Back to Dashboard
            </button>
    </div>
  );
};

export default ProfilePage;