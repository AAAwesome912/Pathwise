import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NowServingDisplayPage = ({ office = 'Registrar' }) => {
  const [nowServing, setNowServing] = useState(null);

  useEffect(() => {
    const fetchNowServing = async () => {
      try {
        const res = await axios.get(`http://192.168.101.18:3001/api/tickets/office/${office}`);
        const tickets = res.data;

        if (tickets.length > 0) {
          setNowServing(tickets[0]); // show the first ticket
        } else {
          setNowServing(null);
        }
      } catch (err) {
        console.error('Error fetching ticket data', err);
      }
    };

    fetchNowServing();
    const interval = setInterval(fetchNowServing, 3000); // refresh every 3 seconds
    return () => clearInterval(interval);
  }, [office]);

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Now Serving - {office}
      </h1>
      {nowServing ? (
        <div className="bg-white px-12 py-10 rounded-2xl shadow-xl">
          <p className="text-gray-600 text-xl">Ticket Number</p>
          <p className="text-7xl font-extrabold text-blue-600 mt-2">#{nowServing.id}</p>
          <p className="text-lg text-gray-500 mt-4">{nowServing.name}</p>
          <p className="text-md text-gray-400">{nowServing.service}</p>
        </div>
      ) : (
        <p className="text-3xl text-gray-500">No one is currently being served.</p>
      )}
    </div>
  );
};

export default NowServingDisplayPage;
