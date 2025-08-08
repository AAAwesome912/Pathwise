import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from '../../utils/axiosInstance';
import { Megaphone, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fieldLabels = {
  fullName: 'Full Name',
  email: 'Email',
  contactNumber: 'Contact Number',
  address: 'Address',
  course: 'Course',
  yearLevel: 'Year Level',
  bookTitle: 'Book Title',
  lastAcademicYear: 'Academic Year Attended',
  requestType: 'Request Type',
  certificationType: 'Certification Type',
  gradesSemester: 'Semester',
  authenticationType: 'Authentication Type',
  otherDocument: 'Other Document',
  numberOfCopies: 'Number of Copies',
  purpose: 'Purpose',
  priority_lane:'Priority',
};

const safeParse = (data) => {
  try {
    const parsed = JSON.parse(data);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
};

const QueueManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [windows, setWindows] = useState({});
  const [prevTicketIds, setPrevTicketIds] = useState(new Set());
  const audioRef = useRef(null);
    const [openDetailsIds, setOpenDetailsIds] = useState(new Set());

     const toggleDetails = (id) => {
    setOpenDetailsIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const fetchNewTicketNotifications = useCallback(async () => {
    if (!user?.office) return;

    try {
      const { data } = await axios.get(`/api/tickets/active/${user.office}`);
      const currentIds = new Set();

      data.forEach((raw) => {
        currentIds.add(raw.id);
      });

      currentIds.forEach((id) => {
        if (!prevTicketIds.has(id)) {
          audioRef.current?.play().catch((err) => console.log('Sound play error:', err));
          toast.info('🎟 New ticket added to the queue!', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      });

      setPrevTicketIds(currentIds);
    } catch (err) {
      console.error('Failed to fetch new ticket notifications', err);
    }
  }, [user?.office, prevTicketIds]);

  useEffect(() => {
    const notifInterval = setInterval(() => {
      fetchNewTicketNotifications();
    }, 3000);

    return () => clearInterval(notifInterval);
  }, [fetchNewTicketNotifications]);

  const fetchQueue = useCallback(async () => {
    if (!user?.office) return;
    try {
      const { data } = await axios.get(`/api/tickets/active/${user.office}`);
      const grouped = {};
      data.forEach((raw) => {
        const ticket = {
          ...raw,
          priority: raw.priority_lane === 1, 
          additional_info:
            typeof raw.additional_info === 'string'
              ? safeParse(raw.additional_info)
              : raw.additional_info,
        };

        const w = ticket.window_no || 'unassigned';
        if (!grouped[w]) grouped[w] = { in_progress: [], called: [], waiting: [] };
        grouped[w][ticket.status]?.push(ticket);
      });

      // Sort tickets inside each status bucket: priority tickets first, then by ticket number
      Object.values(grouped).forEach((g) => {
        Object.keys(g).forEach((k) =>
          g[k].sort((a, b) => {
            if (a.priority && !b.priority) return -1;
            if (!a.priority && b.priority) return 1;
            return a.office_ticket_no - b.office_ticket_no;
          })
        );
      });

      setWindows(grouped);
    } catch (err) {
      console.error('Failed to fetch queue', err);
    }
  }, [user?.office]);

  useEffect(() => {
    if (!user?.office) return;
    fetchQueue();
    const id = setInterval(fetchQueue, 3000);
    return () => clearInterval(id);
  }, [fetchQueue, user?.office]);

  if (!user) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-xl">
        <p className="text-gray-600">Loading user info...</p>
      </div>
    );
  }

  const patchStatus = async (id, status) => axios.patch(`/api/tickets/${id}/status`, { status });

  const handleServeNow = async (ticket) => {
    try {
      await axios.patch(`/api/tickets/${ticket.id}/serve`, { windowNo: user?.windowNo });
      fetchQueue();
    } catch (err) {
      toast.error('Failed to start serving ticket');
    }
  };

  const handleCall = async (ticket) => {
    try {
      await axios.patch(`/api/tickets/${ticket.id}/status`, {
        status: 'called',
        windowNo: user?.windowNo,
      });
      fetchQueue();
    } catch {
      toast.error('Failed to call');
    }
  };

  const handleFinish = async (ticket) => {
    try {
      await patchStatus(ticket.id, 'done');
      fetchQueue();
    } catch {
      toast.error('Failed to finish');
    }
  };

  const handleResetTickets = async () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset the ticket numbers for this office? This action cannot be undone.'
    );
    if (!confirmReset) return;
    try {
      await axios.post(`/api/tickets/reset-office-ticket`, {
        office: user?.office,
      });
      toast.success('Ticket numbers have been reset.');
      fetchQueue();
    } catch (err) {
      console.error('Reset failed:', err);
      toast.error('Failed to reset ticket numbers.');
    }
  };

  const handleViewRecords = () => {
    navigate('/records');
  };

   const TicketCard = ({ t, showCall, showServe }) => (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between gap-4">
        <div>
          {t.window_no && (
            <p className="text-sm text-gray-500">
              Assigned: <span className="font-medium">{t.window_no}</span>
            </p>
          )}
          <p
            className={`font-semibold ${
              t.status === 'called' ? 'text-orange-500' : 'text-blue-600'
            } flex items-center gap-2`}
          >
            {t.priority && (
              <AlertTriangle
                size={18}
                className="text-red-600 animate-pulse"
                style={{ animationDuration: '1.5s', animationIterationCount: 'infinite' }}
              />
            )}
            Ticket #{t.office_ticket_no ?? t.id}
            {t.priority && (
              <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                PRIORITY
              </span>
            )}
          </p>
          <p>
            <strong>Name:</strong> {t.name || 'N/A'}
          </p>
          <p>
            <strong>Service:</strong> {t.service}
          </p>

          {t.additional_info && (
            <details
              className="mt-1"
              open={openDetailsIds.has(t.id)}
              onClick={(e) => {
                e.preventDefault(); // Prevent default toggle
                toggleDetails(t.id);
              }}
            >
              <summary className="cursor-pointer text-sm text-blue-500 underline">Details</summary>
              <ul className="list-disc ml-5 text-sm text-gray-700">
                {Object.entries(t.additional_info).map(([k, v]) => (
                  <li key={k}>
                    <strong>{fieldLabels[k] || k}:</strong> {v}
                  </li>
                ))}
                <li>
                  <strong>{fieldLabels.priority_lane || 'Priority'}:</strong> {t.priority ? 'Yes' : 'No'}
                </li>  
              </ul>
            </details>
          )}
        </div>
        <div className="flex flex-col gap-2 ml-auto">
          {showCall && (
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded flex items-center gap-1"
              onClick={() => handleCall(t)}
            >
              Call Next
              <Megaphone size={16} className="ml-1 text-white animate-wiggle" />
            </button>
          )}
          {showServe && (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
              onClick={() => handleServeNow(t)}
            >
              Serve Now
            </button>
          )}
          {t.status === 'in_progress' && (
            <button
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
              onClick={() => handleFinish(t)}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 md:p-8 rounded-xl shadow-xl">
      <audio ref={audioRef} src={process.env.PUBLIC_URL + '/sounds/dong.mp3'} preload="auto" />
      <ToastContainer />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Queue Management&nbsp;
          <span className="text-3xl font-bold text-gray-800">({user?.office || 'Unknown'})</span>
        </h1>
        <button
          onClick={handleViewRecords}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          View Records
        </button>
      </div>

      {Object.values(windows).every(
        (bucket) =>
          bucket.in_progress.length === 0 && bucket.called.length === 0 && bucket.waiting.length === 0
      ) ? (
        <div className="text-center py-8 text-gray-600">
          <p className="text-lg font-medium">🎧 No customers at the moment.</p>
        </div>
      ) : (
        Object.entries(windows)
          .filter(
            ([, buckets]) =>
              buckets.in_progress.length > 0 ||
              buckets.called.length > 0 ||
              buckets.waiting.length > 0
          )
          .map(([windowNo, buckets]) => (
            <div key={windowNo} className="mb-10">
              <h2 className="text-xl font-bold text-gray-700 mb-3">
                {windowNo && windowNo.toLowerCase() !== 'unassigned'
                  ? windowNo.toLowerCase().includes('window')
                    ? windowNo
                    : `Window ${windowNo}`
                  : 'Unassigned Window'}
              </h2>

              {buckets.in_progress.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-green-600 mb-2">Currently Serving</h3>
                  {buckets.in_progress.map((t) => (
                    <TicketCard key={t.id} t={t} />
                  ))}
                </>
              )}

              {buckets.waiting.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Waiting</h3>
                  {buckets.waiting.map((t) => (
                    <TicketCard key={t.id} t={t} showCall />
                  ))}
                </>
              )}

              {buckets.called.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-orange-600 mb-2">Called</h3>
                  {buckets.called.map((t) => (
                    <TicketCard key={t.id} t={t} showServe />
                  ))}
                </>
              )}
            </div>
          ))
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => navigate('/staff')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back to Dashboard
        </button>
        <div className="flex gap-4">
          <button
            onClick={handleResetTickets}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Reset Ticket Numbers
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueueManagementPage;
