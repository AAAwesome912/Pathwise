import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../utils/axiosInstance'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [queueCount, setQueueCount] = useState(0);
  const prevQueueCount = useRef(0);
  const audioRef = useRef(null);

  useEffect(() => {
  const fetchQueueCount = async () => {
  if (!user || !user.office) return;

  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(
      `/api/tickets/office/${user.office}/waiting-count`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const waitingCount = res.data.waitingCount || 0;

    if (waitingCount > prevQueueCount.current) {
      audioRef.current?.play().catch(err => console.log('Sound play error:', err));
      toast.info('🔔 New student added to the queue!');
    }

    prevQueueCount.current = waitingCount;
    setQueueCount(waitingCount);
  } catch (err) {
    console.error('Failed to fetch queue count', err);
    toast.error('❌ Unauthorized access. Please log in again.');
  }
};


  fetchQueueCount();

  const interval = setInterval(fetchQueueCount, 100);

  return () => clearInterval(interval);
}, [user]);



  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      {/* 🔊 Hidden audio + toast container */}
      <audio
        ref={audioRef}
        src={process.env.PUBLIC_URL + '/sounds/dong.mp3'}
        preload="auto"
      />
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Staff Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Welcome, <span className="font-semibold text-gray-800">{user?.name || 'Staff'}</span>!<br />
        You are assigned to the{' '}
        <span className="font-semibold text-blue-600">{user?.office || 'Unknown Office'}</span>
        {user?.office === 'Registrar' && <> <span className="font-semibold text-blue-600">{user?.windowNo}</span></>}
        {user?.office === 'Library' && <> <span className="font-semibold text-blue-600">{user?.section}</span></>}
        {user?.office === 'Departmental' && <> <span className="font-semibold text-blue-600">{user?.department}</span></>}
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-blue-700">Current Queue</h2>
          <p className="text-4xl font-bold text-blue-600 my-2">{queueCount}</p>
          <p className="text-sm text-gray-600">
            Students waiting for {user?.office || 'your service'}
            {user?.office === 'Registrar' && ` ${user?.windowNo}`}
            {user?.office === 'Library' && ` ${user?.section}`}
            {user?.office === 'Departmental' && ` ${user?.department}`}.
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-green-700">Service Status</h2>
          <p className="text-2xl font-bold text-green-600 my-2">Online</p>
          <p className="text-sm text-gray-600">You are actively serving students.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
  <button
    onClick={() => navigate('/queueManagement')}
    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center justify-center text-lg"
  >
    <Users size={24} className="mr-2" />
    Manage Queue
  </button>

  <button
    onClick={() => navigate('/records')}
    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center justify-center text-lg"
  >
    📋 View Records
  </button>
</div>

    </div>
  );
};

export default StaffDashboard;
