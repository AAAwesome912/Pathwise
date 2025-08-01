import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Preload sounds
const sounds = {
  called: new Audio('public/called.mp3'),
  in_progress: new Audio('public/in_progress.mp3'),
  done: new Audio('public/done.mp3'),
};

const MyTicketsPage = ({ newlyCreatedTicket }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [nowServing, setNowServing] = useState(null);
  const notifiedStatus = useRef({});
  const prevTicketsRef = useRef([]);

  useEffect(() => {
    if (user?.id) {
      const interval = setInterval(() => {
        axios
          .get(`http://192.168.101.18:3001/api/tickets/user/${user.id}`)
          .then(res => {
            const newTickets = res.data;

            // Notify and play sound on status change
            newTickets.forEach(ticket => {
              const prevTicket = prevTicketsRef.current.find(t => t.id === ticket.id);
              const prevStatus = prevTicket?.status;
              const currentStatus = ticket.status;
              const statusKey = `${ticket.id}-${currentStatus}`;

              if (prevStatus !== currentStatus && !notifiedStatus.current[statusKey]) {
                if (currentStatus === 'in_progress') {
                  toast.info(`🎫 Ticket #${ticket.office_ticket_no} is now being served.`);
                  sounds.in_progress.play();
                } else if (currentStatus === 'called') {
                  toast.info(`📢 Ticket #${ticket.office_ticket_no} is being called. Please proceed to the counter.`);
                  sounds.called.play();
                } else if (currentStatus === 'done') {
                  toast.success(`✅ Ticket #${ticket.office_ticket_no} has been marked as done.`);
                  sounds.done.play();
                }
                notifiedStatus.current[statusKey] = true;
              }
            });

            prevTicketsRef.current = newTickets;
            setTickets(newTickets.filter(t => t.status !== 'done')); // filter out done tickets
          })
          .catch(err => console.error('Error fetching tickets:', err));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchNowServing = async () => {
      try {
        const firstTicket = tickets[0];
        if (firstTicket && firstTicket.office) {
          const response = await axios.get(`http://192.168.101.18:3001/api/tickets/now-serving/${firstTicket.office}`);
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
  try {
    const response = await axios.put(
      `http://192.168.101.18:3001/api/tickets/cancel/${office}/${officeTicketNo}`
    );
    alert(response.data.message);

    // Remove the cancelled ticket from the state
    setTickets(prev =>
      prev.filter(ticket => !(ticket.office === office && ticket.office_ticket_no === officeTicketNo))
    );
  } catch (error) {
    console.error('Failed to cancel ticket:', error);
    alert(
      error.response?.data?.error ||
      'Something went wrong while cancelling the ticket.'
    );
  }
};


  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Active Tickets</h1>
      <ToastContainer position="bottom-right" />
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
                <button
                  onClick={() => navigate('/map')}
                  className="mt-7 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded-md transition duration-100"
                >
                  Use Campus Map
                </button>
                   {ticket.status === 'waiting' && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                    onClick={() => cancelTicket(ticket.office, ticket.office_ticket_no)}
                  >
                    Cancel Ticket
                  </button>

                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/Dashboard')}
        className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default MyTicketsPage;
