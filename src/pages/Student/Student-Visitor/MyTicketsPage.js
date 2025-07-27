import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const MyTicketsPage = ({ newlyCreatedTicket }) => {
  const navigate = useNavigate(); 
  const [tickets, setTickets] = useState([
    { id: 'REG-005', service: 'Transcript Request', office: 'Registrar - Quadrangle Bldg.', status: 'Called (Proceed to Counter 2)', position: 0, navDetails: "Quadrangle Building, Ground Floor, Registrar's Office, Counter 2." },
    { id: 'LIB-001', service: 'Borrow Books', office: 'Library - 2nd Floor', status: 'Waiting (Est. 15 mins)', position: 3, navDetails: "Go to Main Library, 2nd Floor, Section A." },
  ]);

  useEffect(() => {
    if (newlyCreatedTicket && !tickets.find(t => t.id === newlyCreatedTicket.id)) {
      setTickets(prevTickets => [newlyCreatedTicket, ...prevTickets]);
    }
    // In a real app, you would fetch tickets for the user from a backend.
    // This effect is just to add a newly submitted mock ticket to the top of the list.
  }, [newlyCreatedTicket, tickets]);


  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Active Tickets</h1>
      {tickets.length === 0 ? (
        <p className="text-gray-600">You have no active tickets. Go to "Find a Service" to create one.</p>
      ) : (
        <div className="space-y-6">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-blue-600">{ticket.service}</h2>
                  <p className="text-sm text-gray-500">Ticket #: <span className="font-medium">{ticket.id}</span></p>
                  <p className="text-sm text-gray-500">Office: <span className="font-medium">{ticket.office}</span></p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  ticket.status.includes('Waiting') ? 'bg-yellow-100 text-yellow-800' :
                  ticket.status.includes('Called') || ticket.status.includes('Serving') ? 'bg-green-100 text-green-800' :
                  ticket.status.includes('Submitted') ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800' // Default/Completed
                }`}>
                  {ticket.status}
                </span>
              </div>
              {ticket.position > 0 && <p className="mt-2 text-sm text-gray-600">Your position in queue: <span className="font-bold">{ticket.position}</span></p>}
              {ticket.position === 'N/A' && ticket.status.includes('Submitted') && <p className="mt-2 text-sm text-gray-600">Your request is being processed.</p>}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-700 mb-1">Navigation:</h3>
                <p className="text-sm text-gray-600 flex items-start">
                  <MapPin size={18} className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                  {ticket.navDetails}
                </p>
                  <button onClick={() => navigate('/map')} className="mt-7 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded-md transition duration-100">
                   Use Campus Map
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
        <button onClick={() => navigate('/Dashboard')} className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150">
                Back to Dashboard
            </button>
    </div>
  );
};


export default MyTicketsPage;