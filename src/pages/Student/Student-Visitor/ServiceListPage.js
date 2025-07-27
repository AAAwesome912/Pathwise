import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, User, BookOpen } from 'lucide-react';

const ServiceListPage = () => {
  const navigate = useNavigate();       // ← FIX: no destructuring

  const services = [
    { id: 1, name: "Request for Academic Records", office: "Registrar", description: "Request your official academic records.", icon: <Briefcase size={24} /> },
    { id: 2, name: "ID Verification",             office: "Registrar", description: "Verify your ID for validation.",           icon: <User size={24} /> },
    { id: 3, name: "Borrow Books",                office: "Library",   description: "Borrow books for your studies.",           icon: <BookOpen size={24} /> },
  ];

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h1 className="text-3xl font-bold mb-2">Available Services</h1>
      <p className="text-gray-600 mb-6">Choose a service you need assistance with.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {services.map(s => (
          <div key={s.id} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex items-center mb-3">
              <div className="p-3 rounded-full bg-gray-200 mr-4">{s.icon}</div>
              <div>
                <h2 className="text-xl font-semibold">{s.name}</h2>
                <p className="text-sm text-gray-500">Office: {s.office}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4 text-sm">{s.description}</p>
            <button
              onClick={() => 
                navigate('/request-service', { 
                  state: { serviceName: s.name } 
                })
              }
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
            >
              Request Service
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/Dashboard')}
        className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md transition"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ServiceListPage;
