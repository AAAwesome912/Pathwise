import React from 'react';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const ServiceManagementPage = () => {
  const navigate  = useNavigate();
    const services = [
        { id: 1, name: "Borrow Books", office: "Library", formFields: 2, isActive: true },
        { id: 2, name: "Transcript Request", office: "Registrar", formFields: 3, isActive: true },
        { id: 3, name: "ID Application", office: "Student Affairs", formFields: 5, isActive: false },
    ];
     return (
        <div className="bg-white p-8 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Service Management</h1>
                <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md flex items-center transition duration-150">
                    <PlusCircle size={20} className="mr-2" /> Add New Service
                </button>
            </div>
             <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Service Name</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Assigned Office</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Form Fields</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Status</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {services.map(service => (
                            <tr key={service.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4">{service.name}</td>
                                <td className="py-3 px-4">{service.office}</td>
                                <td className="py-3 px-4">{service.formFields}</td>
                                <td className="py-3 px-4"><span className={`capitalize px-2 py-1 text-xs rounded-full ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{service.isActive ? 'Active' : 'Inactive'}</span></td>
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
export default ServiceManagementPage;