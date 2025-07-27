import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from 'lucide-react';

const QueueManagementPage = () => {
    const navigate  = useNavigate();
    // Mock queue data
    const queue = [
        { ticket: "LIB-003", studentName: "Alice Wonderland", studentId: "S1001", serviceDetails: "Book: 'The Great Gatsby'", timestamp: "10:05 AM" },
        { ticket: "LIB-004", studentName: "Bob The Builder", studentId: "S1002", serviceDetails: "Book: 'Intro to Algorithms'", timestamp: "10:08 AM" },
        { ticket: "LIB-005", studentName: "Charlie Brown", studentId: "S1003", serviceDetails: "Book: 'React for Dummies'", timestamp: "10:12 AM" },
    ];
    const nowServing = { ticket: "LIB-002", studentName: "Eve Harrington", studentId: "S1000", serviceDetails: "Book: 'Physics Vol. 1'", timestamp: "10:02 AM" };

    return (
        <div className="bg-white p-8 rounded-xl shadow-xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Queue Management: Library Book Checkout</h1>
            
            {nowServing && (
                <div className="mb-8 p-6 rounded-lg bg-green-50 border border-green-200 shadow">
                    <h2 className="text-xl font-semibold text-green-700 mb-2">Now Serving: <span className="text-green-600 font-bold">{nowServing.ticket}</span></h2>
                    <p><strong>Student:</strong> {nowServing.studentName} ({nowServing.studentId})</p>
                    <p><strong>Details:</strong> {nowServing.serviceDetails}</p>
                    <p className="text-sm text-gray-500">Called at: {nowServing.timestamp}</p>
                    <div className="mt-4 flex space-x-3">
                        <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-150">
                            <Ticket className="inline mr-1 h-5 w-5" /> Mark as Completed
                        </button>
                         <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition duration-150">
                            No Show
                        </button>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Waiting Queue ({queue.length})</h2>
            {queue.length === 0 && !nowServing ? (
                <p className="text-gray-600">The queue is currently empty.</p>
            ) : queue.length === 0 && nowServing ? (
                 <p className="text-gray-600">No more students in the waiting queue.</p>
            ) : (
                <div className="space-y-4">
                    {queue.map((item, index) => (
                        <div key={item.ticket} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold text-blue-600">{item.ticket} <span className="text-sm text-gray-500 font-normal">- Submitted at {item.timestamp}</span></p>
                                    <p><strong>Student:</strong> {item.studentName} ({item.studentId})</p>
                                    <p><strong>Details:</strong> {item.serviceDetails}</p>
                                </div>
                                {index === 0 && ( // Only show "Call Next" for the first in queue
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-md transition duration-150">
                                        Call Next
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
             <button onClick={() => navigate('/staff')} className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150">
                Back to Dashboard
            </button>
        </div>
    );
};

export default QueueManagementPage;