import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QueueManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [nowServing, setNowServing] = useState(null);
  const [showDetailsId, setShowDetailsId] = useState(null);
  const audioRef = useRef(null); // 🔊 For sound notification
  const BASE_URL = 'http://192.168.101.18:3001';

  const safeParse = (data) => {
    try {
      const parsed = JSON.parse(data);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  };

  const fieldLabels = {
    fullName: 'Full Name',
    email: 'Email',
    contactNumber: 'Contact Number',
    address: 'Address',
    course: 'Course',
    yearLevel: 'Year Level',
    bookTitle: "Book Title",
    lastAcademicYear: "Academic Year Attended",
    requestType: "Request Type",
    certificationType: "Certification Type",
    gradesSemester: "Semester",
    authenticationType: "Authentication Type",
    otherDocument: "Other Document",
    numberOfCopies: "Number of Copies",
    purpose: "Purpose",
  };

  const renderDetails = (info) => (
    <ul className="list-disc ml-5 text-sm text-gray-700">
      {Object.entries(info).map(([key, value]) => (
        <li key={key}>
          <strong>{fieldLabels[key] || key}:</strong> {value}
        </li>
      ))}
    </ul>
  );

  const fetchQueue = useCallback(async () => {
    if (!user?.office) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/tickets/office/${user.office}`);
      const tickets = res.data.map(ticket => ({
        ...ticket,
        additional_info:
          typeof ticket.additional_info === 'string'
            ? safeParse(ticket.additional_info)
            : ticket.additional_info,
      }));

      const inProgress = tickets.find(t => t.status === 'in_progress');
      const waiting = tickets.filter(t => t.status === 'waiting');

      // 🔔 Notify when there's a new ticket in queue
      if (queue.length && waiting.length > queue.length) {
        toast.info('🔔 New ticket in the queue!');
        if (audioRef.current) audioRef.current.play();
      }

      setNowServing(inProgress || null);
      setQueue(waiting);
    } catch (err) {
      console.error('Failed to fetch tickets', err);
    }
  }, [user, queue]);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 100); // auto-refresh
    return () => clearInterval(interval);
  }, [fetchQueue]);

  const handleServeNow = async (ticketId) => {
    try {
      if (nowServing) {
        await axios.patch(`${BASE_URL}/api/tickets/${nowServing.id}/status`, {
          status: 'done',
        });
      }

      await axios.patch(`${BASE_URL}/api/tickets/${ticketId}/serve`, {
        windowNo: user.windowNo,
      });

      await fetchQueue();
    } catch (err) {
      console.error('Failed to serve ticket', err.response?.data || err.message);
    }
  };

  const handleFinish = async (ticketId) => {
    try {
      await axios.patch(`${BASE_URL}/api/tickets/${ticketId}/status`, {
        status: 'done',
      });
      fetchQueue();
    } catch (err) {
      console.error('Failed to finish ticket', err);
    }
  };

  const toggleDetails = (ticketId) => {
    setShowDetailsId(prev => (prev === ticketId ? null : ticketId));
  };

  const handleResetTicketNumbers = async () => {
  try {
    await axios.post(`${BASE_URL}/api/tickets/reset-office-ticket`, {
      office: user.office, // or selected office
    });
    alert(`Ticket numbers reset for ${user.office}`);
  } catch (err) {
    console.error('Reset failed:', err);
    alert(`Failed to reset ticket numbers for ${user.office}`);
  }
};


  if (!user) return <div className="p-8 text-gray-600">Loading user data...</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      {/* 🔊 Audio and Notification container */}
      <audio ref={audioRef} src={process.env.PUBLIC_URL + '/ding.mp3'} preload="auto" />
      <ToastContainer />

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Queue Management: {user.office || 'Your Office'}
      </h1>

      {nowServing ? (
        <div className="mb-8 p-6 rounded-lg bg-green-50 border border-green-200 shadow">
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Now Serving:{' '}
            <span className="text-green-600 font-bold">
              {nowServing.office_ticket_no
                ? `#${user.office[0].toUpperCase()}-${String(nowServing.office_ticket_no).padStart(3, '0')}`
                : `#${nowServing.id}`}
            </span>
          </h2>
          <p><strong>Name:</strong> {nowServing.name || 'N/A'}</p>
          <p><strong>Service:</strong> {nowServing.service}</p>

          {nowServing.additional_info && (
            <>
              <p><strong>Details:</strong></p>
              {renderDetails(nowServing.additional_info)}
            </>
          )}

          <button
            onClick={() => handleFinish(nowServing.id)}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-md"
          >
            Finish Serving
          </button>
        </div>
      ) : (
        <p className="text-gray-600 mb-8">No ticket is currently being served.</p>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Waiting List ({queue.length})
        </h2>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded mt-4"
          onClick={handleResetTicketNumbers}
        >
          Reset Ticket Numbers
        </button>


      </div>

      {queue.length === 0 ? (
        <p className="text-gray-600">No students in the waiting list.</p>
      ) : (
        <div className="space-y-4">
          {queue.map(ticket => (
            <div key={ticket.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold text-blue-600">
                    Ticket #{ticket.office_ticket_no
                      ? `${user.office[0].toUpperCase()}-${String(ticket.office_ticket_no).padStart(3, '0')}`
                      : ticket.id}
                  </p>
                  <p><strong>Name:</strong> {ticket.name || 'N/A'}</p>
                  <p><strong>Service:</strong> {ticket.service}</p>

                  {ticket.additional_info && (
                    <div>
                      <button
                        className="text-sm text-blue-500 underline mt-1 mb-2"
                        onClick={() => toggleDetails(ticket.id)}
                      >
                        {showDetailsId === ticket.id ? 'Hide' : 'Show'} Details
                      </button>
                      {showDetailsId === ticket.id && renderDetails(ticket.additional_info)}
                    </div>
                  )}
                </div>

                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-md"
                  onClick={() => handleServeNow(ticket.id)}
                >
                  Serve Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/staff')}
        className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default QueueManagementPage;
