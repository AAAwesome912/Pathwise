import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';
import { useAuth } from '../../contexts/AuthContext';

const AppointmentManagement = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState({});

  useEffect(() => {
    if (!user) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    const fetchConfirmedAppointments = async () => {
      try {
        setLoading(true);
        // This endpoint fetches all appointments and then we filter them.
        // A more efficient API would have a dedicated endpoint like `/api/appointments/confirmed`.
        const res = await axios.get(`/api/appointments/staff/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        // We filter for appointments that have been confirmed by the student on campus.
        const confirmedAppointments = res.data.filter(appt => appt.status === 'confirmed');
        setAppointments(confirmedAppointments);
      } catch (err) {
        console.error("❌ Error fetching confirmed appointments:", err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedAppointments();
  }, [user]);

  const handleNotifyStudent = async (apptId) => {
    try {
      setNotificationStatus(prev => ({ ...prev, [apptId]: 'sending' }));
      
      // Send a request to a new server endpoint to trigger the notification logic.
      // The server will handle sending the SMS and any other notifications.
      const res = await axios.post(`/api/notifications/send`, { appointmentId: apptId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.success) {
        setNotificationStatus(prev => ({ ...prev, [apptId]: 'sent' }));
        // Optionally, you could update the appointment status in the local state
        // to reflect that the student has been notified.
      } else {
        setNotificationStatus(prev => ({ ...prev, [apptId]: 'failed' }));
        setError("Failed to send notification. Please try again.");
      }
    } catch (err) {
      console.error("❌ Error sending notification:", err);
      setNotificationStatus(prev => ({ ...prev, [apptId]: 'failed' }));
      setError("Failed to send notification. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading confirmed appointments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Error: {error}
      </div>
    );
  }
  
  if (appointments.length === 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Confirmed Appointments</h2>
        <p className="text-gray-600 mb-6">There are no students who have confirmed their arrival on campus yet.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirmed Appointments On Campus</h2>
      {appointments.map(appointment => (
        <div key={appointment.id} className="p-6 border border-gray-200 rounded-xl shadow-sm bg-gray-50 flex justify-between items-center">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-700 mb-1">Appointment for {appointment.service}</h3>
            <p className="text-gray-600"><span className="font-semibold text-gray-800">Student Name:</span> {appointment.name}</p>
            <p className="text-gray-600"><span className="font-semibold text-gray-800">Office:</span> {appointment.office}</p>
          </div>
          <div className="text-right">
            {notificationStatus[appointment.id] === 'sent' ? (
              <p className="text-green-600 font-semibold">Notification Sent!</p>
            ) : notificationStatus[appointment.id] === 'sending' ? (
              <p className="text-blue-500">Sending...</p>
            ) : (
              <button
                onClick={() => handleNotifyStudent(appointment.id)}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                Notify Student
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentManagement;
