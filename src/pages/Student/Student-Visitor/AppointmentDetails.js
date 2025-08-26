import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosInstance';
import { useAuth } from '../../../contexts/AuthContext';

const AppointmentDetails = () => {
  // Access the current user from the authentication context.
  const { user } = useAuth();
  // Hooks for accessing location state and navigating programmatically.
  const location = useLocation();
  const navigate = useNavigate();

  // Get a specific appointmentId from the location state, if available.
  const appointmentId = location.state?.appointmentId;

  // State variables for managing appointments, loading status, errors, and UI visibility.
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState({});

  useEffect(() => {
    // Redirect to the home page if the user is not authenticated.
    if (!user) {
      setError("User not authenticated.");
      setLoading(false);
      navigate('/');
      return;
    }

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Fetch all appointments for the current user. This is a robust approach
        // as it allows us to filter and handle various states on the client side.
        const res = await axios.get(`/api/appointments/users/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        // Filter out appointments that have been cancelled or confirmed,
        // as these are no longer 'active'.
        const activeAppointments = res.data.filter(
          (appt) => appt.status !== 'cancelled' && appt.status !== 'confirmed'
        );
        
        // If a specific appointmentId was provided, find and display only that one.
        // Otherwise, display all active appointments.
        if (appointmentId) {
          const specificAppointment = activeAppointments.find(
            (appt) => appt.id === parseInt(appointmentId)
          );
          setAppointments(specificAppointment ? [specificAppointment] : []);
        } else {
          setAppointments(activeAppointments);
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

  // Handler for cancelling an appointment.
  const handleCancelAppointment = async (apptId) => {
    try {
      await axios.put(`/api/appointments/${apptId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Optimistically update the UI by filtering out the cancelled appointment.
      setAppointments(appointments.filter(appt => appt.id !== apptId));
    } catch (err) {
      console.error("❌ Error cancelling appointment:", err);
      setError("Failed to cancel appointment. Please try again.");
    }
  };

  // Handler for confirming an appointment on campus.
  // This function has been updated to use a more standard API endpoint.
  const handleConfirmInCampus = async (apptId) => {
    try {
      // The API call is now a PUT request to the main appointment endpoint with a status update in the body.
      const res = await axios.put(`/api/appointments/${apptId}`, { status: 'confirmed' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        // Navigate to the tickets page upon successful confirmation.
        navigate('/my-tickets', { state: { ticketId: res.data.ticketId } });
      } else {
        setError("Failed to confirm appointment. Server returned an error.");
      }
    } catch (err) {
      console.error("❌ Error confirming appointment:", err);
      setError("Failed to confirm appointment. Please try again.");
    }
  };

  // Render a loading state while data is being fetched.
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading appointments...
      </div>
    );
  }

  // Render an error message if an error occurs.
  if (error) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Error: {error}
      </div>
    );
  }
  
  // Render a message and button if no appointments are found.
  if (appointments.length === 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Appointments Found 😔</h2>
        <p className="text-gray-600 mb-6">It looks like you don't have any pending appointments. Let's make one!</p>
        <button
          onClick={() => navigate('/appointment')}
          className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          Book an Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Appointments</h2>
      {appointments.map(appointment => {
        let additionalInfo = {};
        
        try {
          // Attempt to parse additional_info, handling both string and object formats.
          if (typeof appointment.additional_info === 'string') {
            additionalInfo = JSON.parse(appointment.additional_info);
          } else if (typeof appointment.additional_info === 'object' && appointment.additional_info !== null) {
            additionalInfo = appointment.additional_info;
          }
        } catch (e) {
          console.error("Failed to parse additional info:", e);
          additionalInfo = {}; // Fallback to an empty object on error
        }

        // Extract priority_lane and remove it from the main object for separate display.
        const priorityLane = additionalInfo.priority_lane === 1 ? 'Yes' : 'No';
        const infoToDisplay = { ...additionalInfo };
        delete infoToDisplay.priority_lane;

        return (
          <div key={appointment.id} className="p-6 border border-gray-200 rounded-xl shadow-sm bg-gray-50">
            <h3 className="text-xl font-bold text-gray-700 mb-2">Appointment for {appointment.service}</h3>
            <div className="text-gray-600 space-y-1">
              <p><span className="font-semibold text-gray-800">ID:</span> {appointment.id}</p>
              <p><span className="font-semibold text-gray-800">Name:</span> {appointment.name}</p>
              <p><span className="font-semibold text-gray-800">Office:</span> {appointment.office}</p>
              <p><span className="font-semibold text-gray-800">Date:</span> {new Date(appointment.appointment_date).toDateString()}</p>
              <p><span className="font-semibold text-gray-800">Time:</span> {appointment.appointment_time}</p>
            </div>
            
            <hr className="my-4 border-gray-200" />
            
            {/* Show/Hide additional information section */}
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-lg text-gray-800">Additional Information</h3>
              <button
                onClick={() => setShowAdditionalInfo(prev => ({
                  ...prev,
                  [appointment.id]: !prev[appointment.id]
                }))}
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                {showAdditionalInfo[appointment.id] ? 'Hide' : 'Show'}
              </button>
            </div>

            {showAdditionalInfo[appointment.id] && (
              <div className="space-y-2 mt-4 text-gray-700">
                <div className="flex items-start">
                  <p className="font-semibold w-1/3 text-gray-800">Priority Lane:</p>
                  <p className="flex-1">{priorityLane}</p>
                </div>
                {/* Dynamically render other additional properties */}
                {Object.keys(infoToDisplay).length > 0 && (
                  Object.keys(infoToDisplay).map((key) => (
                    <div key={key} className="flex items-start">
                      <p className="font-semibold w-1/3 text-gray-800">
                        {/* Format the key for display (e.g., 'studentId' becomes 'Student Id') */}
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                      </p>
                      <p className="flex-1">{infoToDisplay[key]}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Action buttons based on appointment status */}
            <div className="flex justify-end space-x-2 mt-4">
              {appointment.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleCancelAppointment(appointment.id)}
                    className="px-4 py-2 text-sm font-semibold text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleConfirmInCampus(appointment.id)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Confirm in Campus
                  </button>
                </>
              )}
              {appointment.status === 'confirmed' && (
                <p className="text-green-600 font-semibold px-4 py-2">Appointment Confirmed</p>
              )}
              {appointment.status === 'cancelled' && (
                <p className="text-red-600 font-semibold px-4 py-2">Appointment Cancelled</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentDetails;
