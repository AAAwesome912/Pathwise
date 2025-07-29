import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext'; // ✅ fixed path
import { Search, Ticket, User, Map } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
const dashboardTitle = user?.role === 'visitor' 
  ? 'Visitor Dashboard' 
  : 'Student Dashboard';

const welcomeMessage = user?.role === 'visitor'
  ? `Welcome, ${user?.name || 'Visitor'}! You may explore available services.` 
  : `Welcome, ${user?.name || 'Student'}! Manage your requests and profile below.`;

return (
  <div className="bg-white p-8 rounded-xl shadow-xl">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">{dashboardTitle}</h1>
    <p className="text-gray-600 mb-4">{welcomeMessage}</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/services')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex flex-col items-center justify-center"
        >
          <Search size={48} className="mb-2" />
          <span className="text-xl">Find a Service</span>
          <span className="text-sm opacity-80">Browse and request school services</span>
        </button>

        <button
          onClick={() => navigate('/my-tickets')}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex flex-col items-center justify-center"
        >
          <Ticket size={48} className="mb-2" />
          <span className="text-xl">My Tickets</span>
          <span className="text-sm opacity-80">Check your queue status</span>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex flex-col items-center justify-center"
        >
          <User size={48} className="mb-2" />
          <span className="text-xl">My Profile</span>
          <span className="text-sm opacity-80">View and update your details</span>
        </button>

        <button
          onClick={() => navigate('/map')}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold p-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex flex-col items-center justify-center"
        >
          <Map size={48} className="mb-2" />
          <span className="text-xl">Campus Map</span>
          <span className="text-sm opacity-80">Navigate your way around campus</span>
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
