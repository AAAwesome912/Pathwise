import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosInstance';
import { MapPin } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyTicketsPage = ({ newlyCreatedTicket }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [showHistory, setShowHistory] = useState(false);
  const [nowServing, setNowServing] = useState(null);
  const notifiedStatus = useRef({});
  const prevTicketsRef = useRef([]);

  useEffect(() => {
    const stored = localStorage.getItem('notifiedStatus');
    if (stored) {
      notifiedStatus.current = JSON.parse(stored);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      const interval = setInterval(() => {
        axios
          .get(`/api/tickets/user/${user.id}`)
          .then(res => {
            const newTickets = res.data;

            const currentActive = [];
            const currentHistory = [];

            newTickets.forEach(ticket => {
              if (ticket.status === 'done' || ticket.status === 'cancelled') {
                currentHistory.push(ticket);
              } else {
                currentActive.push(ticket);
              }

              const prevTicket = prevTicketsRef.current.find(t => t.id === ticket.id);
              const prevStatus = prevTicket?.status;
              const currentStatus = ticket.status;
              const lastNotifiedStatus = notifiedStatus.current[ticket.id];

              if (prevStatus !== currentStatus && lastNotifiedStatus !== currentStatus) {
                if (currentStatus === 'in_progress') {
                  toast.info(`🎫 Ticket #${ticket.office_ticket_no} is now being served.`);
                  const audio = new Audio('/sounds/in_progress.mp3');
                  audio.play().catch(err =>
                    console.warn('🔇 in_progress sound blocked:', err.message)
                  );
                } else if (currentStatus === 'called') {
                  const windowMessage = ticket.window_no
                    ? ` Please proceed to ${ticket.window_no}.`
                    : ' Please proceed to the counter.';

                  toast.info(`📢 Ticket #${ticket.office_ticket_no} is being called.${windowMessage}`);

                  const windowNo = ticket.window_no;
                  let audioSrc;

                  switch (windowNo) {
                    case 'Window 1':
                      audioSrc = '/sounds/window1.mp3';
                      break;
                    case 'Window 2':
                      audioSrc = '/sounds/window2.mp3';
                      break;
                    case 'Window 3':
                      audioSrc = '/sounds/window3.mp3';
                      break;
                    default:
                      audioSrc = '/sounds/called.mp3';
                  }

                  const audio = new Audio(audioSrc);
                  audio.play().catch(err =>
                    console.warn(`🔇 sound for window ${windowNo} blocked:`, err.message)
                  );
                } else if (currentStatus === 'done') {
                  toast.success(`✅ Ticket #${ticket.office_ticket_no} has been served.`);
                  const audio = new Audio('/sounds/done.mp3');
                  audio.play().catch(err =>
                    console.warn('🔇 done sound blocked:', err.message)
                  );
                }

                notifiedStatus.current[ticket.id] = currentStatus;
                localStorage.setItem('notifiedStatus', JSON.stringify(notifiedStatus.current));
              }
            });

            prevTicketsRef.current = newTickets;
            setTickets(currentActive);
            setHistory(currentHistory);
          })
          .catch(err => {
            console.error('❌ Failed to fetch tickets:', err);
          });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const fetchNowServing = async () => {
      try {
        const firstTicket = tickets[0];
        if (firstTicket?.office) {
          const response = await axios.get(
            `/api/tickets/now-serving/${firstTicket.office}`
          );
          setNowServing(response.data.nowServingTicketNumber);
        }
      } catch (err) {
        console.error('Error fetching now serving number:', err);
      }
    };

    fetchNowServing();
  }, [tickets]);

  useEffect(() => {
    if (newlyCreatedTicket && !tickets.find(t => t.id === newlyCreatedTicket.id)) {
      setTickets(prev => [newlyCreatedTicket, ...prev]);
    }
  }, [newlyCreatedTicket, tickets]);

  const getBoxColor = status => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-50 border-yellow-300';
      case 'in_progress':
        return 'bg-green-50 border-green-300';
      case 'called':
        return 'bg-blue-50 border-blue-300';
      case 'done':
        return 'bg-gray-100 border-gray-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const cancelTicket = async (office, officeTicketNo) => {
    const confirmCancel = window.confirm(`Are you sure you want to cancel ticket #${officeTicketNo}?`);
    if (!confirmCancel) return;

    try {
      await axios.put(`/api/tickets/cancel/${office}/${officeTicketNo}`);
      toast.warn(`❌ Ticket #${officeTicketNo} has been cancelled.`);
      const cancelSound = new Audio('/sounds/cancelled.mp3');
      cancelSound.play();

      setTickets(prev => prev.filter(t => t.office_ticket_no !== officeTicketNo));
    } catch (error) {
      console.error('Failed to cancel ticket:', error);
      alert(error.response?.data?.error || 'Something went wrong while cancelling the ticket.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <ToastContainer position="bottom-right"/>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Active Tickets</h1>
      
      <p>
        <strong>Now Serving:</strong> {nowServing || 'Loading...'}
      </p>

      {tickets.length === 0 ? (
        <p className="text-gray-600">
          You have no active tickets. Go to "Find a Service" to create one.
        </p>
      ) : (
        <div className="space-y-6">
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              className={`p-6 rounded-lg shadow-md border ${getBoxColor(ticket.status)}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-blue-600">{ticket.service}</h2>
                  <p className="text-sm text-gray-500">
                    Ticket #: <span className="font-medium">{ticket.office_ticket_no}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Office: <span className="font-medium">{ticket.office}</span>
                  </p>

                  {ticket.window_no && (
                    <p className="text-sm text-gray-500">
                      Assigned: <span className="font-medium"> {ticket.window_no}</span>
                    </p>
                  )}
                </div>

                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    ticket.status === 'waiting'
                      ? 'bg-yellow-100 text-yellow-800'
                      : ticket.status === 'in_progress'
                      ? 'bg-green-100 text-green-800'
                      : ticket.status === 'called'
                      ? 'bg-blue-100 text-blue-800'
                      : ticket.status === 'done'
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              {ticket.position && (
                <p className="mt-2 text-sm text-gray-600">
                  Your position in queue: <span className="font-bold">{ticket.position}</span>
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-700 mb-1">Navigation:</h3>
                <p className="text-sm text-gray-600 flex items-start">
                  <MapPin size={18} className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                  {ticket.navDetails || 'Location details unavailable'}
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => navigate('/map')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-2 rounded-md transition duration-100"
                  >
                    Use Campus Map
                  </button>

                  {ticket.status === 'waiting' && (
                    <button
                      onClick={() => cancelTicket(ticket.office, ticket.office_ticket_no)}
                      className="bg-red-500 hover:bg-red-500 text-white px-1 py-0  rounded transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-10">
           <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => setShowHistory(prev => !prev)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded transition"
            >
              {showHistory ? 'Hide Ticket History' : 'Show Ticket History'}
            </button>

            <button
              onClick={() => navigate('/Dashboard')}
              className="bg-gray-200 hover:bg-gray-500 text-gray-700 font-medium py-2 px-2 rounded-md transition duration-100"
            >
              Back to Dashboard
            </button>
          </div>

          {showHistory && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ticket History</h2>

              <label className="block mb-2 font-semibold">Filter by status:</label>
              <select
                value={historyFilter}
                onChange={e => setHistoryFilter(e.target.value)}
                className="mb-4 border rounded px-3 py-2"
              >
                <option value="all">All</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <div className="space-y-4">
               {history
                  .filter(ticket =>
                    historyFilter === 'all' ? true : ticket.status === historyFilter
                  )
                  .map(ticket => (
                    <div key={ticket.id} className="p-4 bg-gray-100 border rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Status:</strong> {ticket.status}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Office:</strong> {ticket.office} | <strong>Service:</strong> {ticket.service}
                      </p>
                      {ticket.created_at && (
                        <p className="text-sm text-gray-500">
                          <strong>Date:</strong> {new Date(ticket.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}

              </div>
            </>
          )}
        </div>
      )}
      
    </div>
  );
};

export default MyTicketsPage;
