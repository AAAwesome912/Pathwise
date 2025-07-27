import React from 'react';
import { useNavigate } from 'react-router-dom';
import {PlusCircle,Edit3,Trash2} from 'lucide-react';

const OfficeManagementPage = () => {
  const navigate  = useNavigate();
    const offices = [
        { id: 1, name: "Main Library", building: "Academic Hall", floor: "2nd", navDetails: "Section A, near the study area." },
        { id: 2, name: "Registrar's Office", building: "Admin Building", floor: "Ground", navDetails: "Window 3 & 4." },
        { id: 3, name: "Student Affairs", building: "Student Center", floor: "1st", navDetails: "Room 101." },
    ];
    return (
        <div className="bg-white p-8 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Office Management</h1>
                <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md flex items-center transition duration-150">
                    <PlusCircle size={20} className="mr-2" /> Add New Office
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Office Name</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Location</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Navigation Details</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {offices.map(office => (
                            <tr key={office.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4">{office.name}</td>
                                <td className="py-3 px-4">{office.building}, {office.floor} Floor</td>
                                <td className="py-3 px-4 truncate max-w-xs">{office.navDetails}</td>
                                <td className="py-3 px-4">
                                    <button className="text-blue-500 hover:text-blue-700 mr-2"><Edit3 size={18} /></button>
                                    <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <button onClick={() => navigate('/admin')} className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150">
                Back to Dashboard
            </button>
        </div>
    );
};
export default OfficeManagementPage;