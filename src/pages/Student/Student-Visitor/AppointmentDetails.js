import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosInstance';
import { useAuth } from '../../../contexts/AuthContext';
import { CheckCircle, XCircle, Info, Trash2 } from 'lucide-react';

const AppointmentDetails = () => {
  // Access the current user from the authentication context.
  const { user } = useAuth();
  // Hooks for accessing location state and navigating programmatically.
  const location = useLocation();
  const navigate = useNavigate();

  // Get a specific appointmentId from the location state, if available.
  const appointmentId = location.state?.appointmentId;

  // State variables for managing appointments, loading status, and errors.
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState({});
  // New state to manage the success message after confirming an appointment.
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  // New state to manage the success message after cancelling an appointment.
  const [cancellationMessage, setCancellationMessage] = useState(null);
  // State to manage which appointment is awaiting confirmation for an action
  const [pendingAction, setPendingAction] = useState(null); // { id: number, type: 'cancel' | 'confirm' }

  // New state for the modal
  const [showModal, setShowModal] = useState(false);

  // Memoize the data fetching function to prevent unnecessary re-creations.
  const fetchData = useCallback(async () => {
    if (!user) {
      setError("User not authenticated.");
      setLoading(false);
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      // Fetch all appointments for the current user.
      const appointmentsRes = await axios.get(`/api/appointments/users/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Filter out cancelled appointments to remove them from the page.
      const allAppointments = appointmentsRes.data.filter(
        (appt) => appt.status !== 'cancelled'
      );

      if (appointmentId) {
        const specificAppointment = allAppointments.find(
          (appt) => appt.id === parseInt(appointmentId)
        );
        setAppointments(specificAppointment ? [specificAppointment] : []);
      } else {
        setAppointments(allAppointments);
      }

    } catch (err) {
      console.error("❌ Error fetching data:", err);
      if (err.response && err.response.status === 404) {
        setError("API endpoints not found. Please check your backend routes.");
      } else {
        setError("Failed to load appointment details or notifications.");
      }
    } finally {
      setLoading(false);
    }
  }, [user, appointmentId, navigate]);

  // Fetch data on component mount and set up a polling interval for appointments.
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds
    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [fetchData]);

  // Handler for cancelling an appointment after confirmation.
  const handleFinalCancel = async (apptId) => {
    try {
      await axios.put(`/api/appointments/${apptId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Set the cancellation success message.
      setCancellationMessage("Your appointment has been successfully cancelled.");
      // Immediately remove the cancelled item from the local state.
      setAppointments(prev => prev.filter(appt => appt.id !== apptId));
      // Clear the message after a few seconds.
      setTimeout(() => setCancellationMessage(null), 5000);
    } catch (err) {
      console.error("❌ Error cancelling appointment:", err);
      setError("Failed to cancel appointment. Please try again.");
    } finally {
      setShowModal(false);
      setPendingAction(null);
    }
  };

  // Handler for confirming an appointment on campus after confirmation.
  const handleFinalConfirm = async (apptId) => {
    try {
      // Send a POST request to update the appointment status on the server.
      await axios.post('/api/appointments/confirm', { appointmentId: apptId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Set the success message to be displayed.
      setConfirmationMessage("Your in-campus confirmation has been successfully submitted!");
      // Immediately update the status in the local state.
      setAppointments(prev => prev.map(appt => 
        appt.id === apptId ? { ...appt, status: 'confirmed' } : appt
      ));
      // Clear the message after a few seconds.
      setTimeout(() => setConfirmationMessage(null), 5000);
    } catch (err) {
      console.error("❌ Error confirming appointment:", err);
      setError("Failed to confirm appointment. Please try again.");
    } finally {
      setShowModal(false);
      setPendingAction(null);
    }
  };

  // Function to open the modal and set the pending action
  const openModal = (actionType, appointmentId) => {
    setPendingAction({ type: actionType, id: appointmentId });
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setPendingAction(null);
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

      {/* Conditional message for successful cancellation */}
      {cancellationMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center mb-4">
          <Trash2 className="w-6 h-6 mr-3 text-red-500" />
          <p className="text-sm font-medium">{cancellationMessage}</p>
        </div>
      )}

      {/* Conditional message for successful confirmation */}
      {confirmationMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center mb-4">
          <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
          <p className="text-sm font-medium">{confirmationMessage}</p>
        </div>
      )}

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
              <p className="flex items-center">
                <span className="font-semibold text-gray-800">Status:</span>
                <span className={`ml-2 font-bold capitalize ${
                  appointment.status === 'pending' ? 'text-yellow-600' :
                  appointment.status === 'confirmed' ? 'text-green-600' :
                  appointment.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {appointment.status}
                </span>
              </p>
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
                    onClick={() => openModal('cancel', appointment.id)}
                    className="px-4 py-2 text-sm font-semibold text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => openModal('confirm', appointment.id)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Confirm in Campus
                  </button>
                </>
              )}
              {appointment.status === 'confirmed' && (
                <p className="text-green-600 font-semibold px-4 py-2 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-1" />
                  Please wait for a message or notification. 
                </p>
              )}
              {appointment.status === 'cancelled' && (
                <p className="text-red-600 font-semibold px-4 py-2 flex items-center">
                  <XCircle className="w-5 h-5 mr-1" />
                  Appointment Cancelled
                </p>
              )}
              {appointment.status === 'processing' &&  (
                <p className="text-blue-600 font-semibold px-4 py-2 flex items-center">
                  <Info className="w-5 h-5 mr-1" />
                  Your request is being processed.
                </p>
              )}
               {appointment.status === 'done' &&  (
                <p className="text-blue-600 font-semibold px-4 py-2 flex items-center">
                  <Info className="w-5 h-5 mr-1" />
                  Your request is done please come to the office.
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Confirmation Modal */}
      {showModal && pendingAction && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {pendingAction.type === 'cancel'
                ? "Confirm Cancellation"
                : "Confirm On-Campus"}
            </h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to {pendingAction.type === 'cancel' ? "cancel" : "confirm"} this appointment? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                No
              </button>
              <button
                onClick={() => {
                  if (pendingAction.type === 'cancel') {
                    handleFinalCancel(pendingAction.id);
                  } else {
                    handleFinalConfirm(pendingAction.id);
                  }
                }}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                  pendingAction.type === 'cancel'
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Yes, {pendingAction.type === 'cancel' ? "Cancel" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetails;
