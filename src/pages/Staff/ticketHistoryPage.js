import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import { useAuth } from '../../contexts/AuthContext';
import {
  Filter,
  ListChecks,
  SquareGanttChart,
  CalendarDays
} from 'lucide-react';

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

const TicketHistoryPage = () => {
  const { user } = useAuth();
  const office = user?.office;
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [windowFilter, setWindowFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [expandedIds, setExpandedIds] = useState({});

    useEffect(() => {
  if (!office) return; // Wait until office is available

  const endpoint = `api/tickets/office/${office}?statusGroup=all`;

  axios.get(endpoint)
    .then(res => {
      const historyTickets = res.data.filter(t => t.status === 'done' || t.status === 'cancelled');
      setTickets(historyTickets);
    })
    .catch(err => console.error('Failed to fetch tickets:', err));
}, [office]);


  const toggleDetails = (ticketId) => {
    setExpandedIds(prev => ({ ...prev, [ticketId]: !prev[ticketId] }));
  };


  const filtered = tickets.filter(t => {
    const statusMatches =
      statusFilter === 'all'
        ? ['done', 'cancelled'].includes(t.status)
        : t.status === statusFilter;

    const matchesService =
      serviceFilter === 'all' || t.service === serviceFilter;

    const matchesWindow =
      windowFilter === 'all' || String(t.window_no ?? 'Unassigned') === windowFilter;

    const matchesDate =
      !dateFilter || new Date(t.created_at).toISOString().slice(0, 10) === dateFilter;

    return statusMatches && matchesService && matchesWindow && matchesDate;
  });

  const groupedByWindow = filtered.reduce((acc, t) => {
    let win = t.window_no ?? 'Unassigned';

    if (t.status === 'cancelled' && t.window_no == null) {
      win = 'Cancelled Only';
    }

    if (!acc[win]) acc[win] = [];
    acc[win].push(t);
    return acc;
  }, {});

  const uniqueServices = [...new Set(tickets.map(t => t.service))];
  const uniqueWindows = [...new Set(tickets.map(t => String(t.window_no ?? 'Unassigned')))];

  return (
    <div className="bg-white p-4 md:p-8 rounded-xl shadow-xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <aside className="w-full md:w-64 border border-gray-200 rounded-lg p-4 shadow-sm h-fit">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <Filter className="w-5 h-5" /> Filters
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block font-medium mb-1 flex items-center gap-1 text-gray-600">
                <ListChecks className="w-4 h-4" /> Status
              </label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1 flex items-center gap-1 text-gray-600">
                <SquareGanttChart className="w-4 h-4" /> Service
              </label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={serviceFilter}
                onChange={e => setServiceFilter(e.target.value)}
              >
                <option value="all">All</option>
                {uniqueServices.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1 flex items-center gap-1 text-gray-600">
                <SquareGanttChart className="w-4 h-4" /> Window
              </label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={windowFilter}
                onChange={e => setWindowFilter(e.target.value)}
              >
                <option value="all">All</option>
                {uniqueWindows.map(win => (
                  <option key={win} value={win}>{win}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1 flex items-center gap-1 text-gray-600">
                <CalendarDays className="w-4 h-4" /> Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-2 py-1"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </aside>

        {/* Ticket Display */}
        <main className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Ticket History</h1>

          <p className="text-sm text-gray-600 mb-4">
            Showing <strong>{filtered.length}</strong> ticket{filtered.length !== 1 ? 's' : ''}
            {statusFilter !== 'all' ? ` with status "${statusFilter}"` : ' (Done + Cancelled)'}
          </p>

          {Object.keys(groupedByWindow).length === 0 ? (
            <p className="text-gray-500 text-center mt-8">
              No tickets found for the selected filter(s).
            </p>
          ) : (
            Object.entries(groupedByWindow).map(([window, records]) => (
              <div key={window} className="mb-6">
                <ul className="space-y-2">
                  {records.map(t => (
                    <li key={t.id} className="border p-4 rounded-md shadow-sm bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p><strong>Status:</strong> {t.status}</p>
                          <p><strong>Service:</strong> {t.service}</p>
                          <p><strong>Submitted:</strong> {new Date(t.created_at).toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => toggleDetails(t.id)}
                          className="text-sm text-blue-600 underline hover:text-blue-800"
                        >
                          {expandedIds[t.id] ? 'Hide Details' : 'Show Details'}
                        </button>
                      </div>

                      {expandedIds[t.id] && (
                        <div className="mt-3 text-sm text-gray-700 border-t pt-3">
                          {t.additional_info && (
                            <div className="mb-2 bg-gray-100 p-3 rounded-md">
                              <strong className="block mb-1 text-gray-800">Additional Info:</strong>
                              <ul className="text-sm text-gray-700 space-y-1 ml-2 list-disc list-inside">
                                {Object.entries(safeParse(t.additional_info)).map(([key, value]) => (
                                  <li key={key}>
                                    <span className="font-medium">{fieldLabels[key] || key}:</span> {String(value)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {t.form_data && Object.keys(t.form_data).length > 0 && (
                            <div>
                              <strong>Form Details:</strong>
                              <ul className="list-disc list-inside ml-4">
                                {Object.entries(t.form_data).map(([key, value]) => (
                                  <li key={key}>
                                    <strong>{key}:</strong> {String(value)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
};

export default TicketHistoryPage;
