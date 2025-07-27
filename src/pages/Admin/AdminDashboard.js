import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import { Users, BookOpen, MapPin,} from 'lucide-react';

// Import only the components actually used
// import UserManagementPage from './UserManagementPage';
// import ServiceManagementPage from './ServiceManagementPage';
// import OfficeManagementPage from './OfficeManagementPage';
// import ProfilePage from './ProfilePage';

const AdminDashboard = () => {
  const  navigate  = useNavigate();
  const  user  = useAuth();
  
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome, {user?.email}! Manage the application settings and data.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button onClick={() => navigate('/userManagement')} className="bg-red-500 hover:bg-red-600 text-white font-semibold p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex flex-col items-center justify-center">
          <Users size={48} className="mb-2" />
          <span className="text-xl">Manage Users</span>
          <span className="text-sm opacity-80">Students & Staff accounts</span>
        </button>
        <button onClick={() => navigate('/serviceManagement')} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex flex-col items-center justify-center">
          <BookOpen size={48} className="mb-2" />
          <span className="text-xl">Manage Services</span>
          <span className="text-sm opacity-80">Add, edit, or remove services</span>
        </button>
        <button onClick={() => navigate('/officeManagement')} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex flex-col items-center justify-center">
          <MapPin size={48} className="mb-2" />
          <span className="text-xl">Manage Offices</span>
          <span className="text-sm opacity-80">Office locations & details</span>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;