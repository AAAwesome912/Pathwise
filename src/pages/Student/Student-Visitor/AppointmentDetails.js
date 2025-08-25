import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosInstance';
import { useAuth } from '../../../contexts/AuthContext';

const AppointmentDetails = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Get appointmentId from state, but don't rely on it being present
  const appointmentId = location.state?.appointmentId;

  // State to hold the appointments and a new state for the toggle
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Use a map to manage the toggle state for each appointment by its ID
  const [showAdditionalInfo, setShowAdditionalInfo] = useState({});

  useEffect(() => {
    // We must have a user to proceed
    if (!user) {
      setError("User not authenticated.");
      setLoading(false);
      navigate('/');
      return;
    }

    const fetchAppointments = async () => {
      try {
        let res;
        if (appointmentId) {
          // If a specific appointmentId is provided via state, fetch that one.
          res = await axios.get(`/api/appointments/${appointmentId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          // Set the single appointment in an array
          setAppointments([res.data]);
        } else {
          // If no specific ID, fetch all appointments for the current user using the correct backend endpoint.
          res = await axios.get(`/api/appointments/users/${user.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setAppointments(res.data);
        }
      } catch (err) {
        console.error("❌ Error fetching appointment details:", err);
        setError("Failed to load appointment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [appointmentId, user, navigate]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (appointments.length === 0) return <div className="p-8">No appointments found.</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded-lg space-y-4">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
      {appointments.map(appointment => {
        let additionalInfo = {};
        let priorityLane = 'No';

        try {
          // Parse additional info from JSON string
          if (typeof appointment.additional_info === 'string') {
            additionalInfo = JSON.parse(appointment.additional_info);
          } else if (typeof appointment.additional_info === 'object') {
            additionalInfo = appointment.additional_info;
          }
          
          if (additionalInfo.priority_lane !== undefined) {
            priorityLane = additionalInfo.priority_lane === 1 ? 'Yes' : 'No';
            delete additionalInfo.priority_lane; // Remove priority_lane from the object so it's not rendered twice
          }
        } catch (e) {
          console.error("Failed to parse additional info:", e);
          additionalInfo = {};
        }

        return (
          <div key={appointment.id} className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Appointment for {appointment.service}</h3>
            <p><span className="font-semibold">ID:</span> {appointment.id}</p>
            <p><span className="font-semibold">Name:</span> {appointment.name}</p>
            <p><span className="font-semibold">Office:</span> {appointment.office}</p>
            {/* Use the correct date and time property names from the backend */}
            <p><span className="font-semibold">Date:</span> {new Date(appointment.appointment_date).toDateString()}</p>
            <p><span className="font-semibold">Time:</span> {appointment.appointment_time}</p>
            <hr className="my-4" />
            
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-lg">Additional Information</h3>
              <button
                onClick={() => setShowAdditionalInfo(prev => ({
                  ...prev,
                  [appointment.id]: !prev[appointment.id]
                }))}
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {showAdditionalInfo[appointment.id] ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Conditionally render the additional info based on the state for this appointment ID */}
            {showAdditionalInfo[appointment.id] && (
              <div className="space-y-2 mt-4">
                <div className="flex items-start">
                  <p className="font-semibold w-1/3">Priority Lane:</p>
                  <p className="flex-1">{priorityLane}</p>
                </div>
                {Object.keys(additionalInfo).length > 0 && (
                  Object.keys(additionalInfo).map((key) => (
                    <div key={key} className="flex items-start">
                      <p className="font-semibold w-1/3">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                      </p>
                      <p className="flex-1">{additionalInfo[key]}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentDetails;
