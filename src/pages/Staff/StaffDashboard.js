import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; 

//import QueueManagementPage from './QueueManagementPage';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Mock data for staff assigned service and current queue count
  const staffService = "Library Book Checkout";
  const queueCount = 5; 

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Staff Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome, {user?.email}! You are assigned to: <span className="font-semibold text-blue-600">{staffService}</span></p>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-blue-700">Current Queue</h2>
            <p className="text-4xl font-bold text-blue-600 my-2">{queueCount}</p>
            <p className="text-sm text-gray-600">Students waiting for {staffService}.</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-green-700">Service Status</h2>
            <p className="text-2xl font-bold text-green-600 my-2">Online</p>
            <p className="text-sm text-gray-600">You are actively serving students.</p>
            {/* Add buttons to go offline/on break */}
        </div>
      </div>

      <button 
        onClick={() => navigate('/queueManagement')} 
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center justify-center text-lg"
      >
        <Users size={24} className="mr-2" />
        Manage Queue
      </button>
    </div>
  );
};

export default StaffDashboard;