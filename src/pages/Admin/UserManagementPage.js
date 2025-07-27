import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';


const UserManagementPage = () => {
  const navigate = useNavigate();
    // Mock data
    const users = [
        { id: 'S001', name: 'Alice Student', email: 'alice@example.com', role: 'student', status: 'Active' },
        { id: 'T001', name: 'Bob Staff', email: 'bob.staff@example.com', role: 'staff', office: 'Library', status: 'Active' },
        { id: 'S002', name: 'Charlie Student', email: 'charlie@example.com', role: 'student', status: 'Inactive' },
    ];

    return (
        <div className="bg-white p-8 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md flex items-center transition duration-150">
                    <PlusCircle size={20} className="mr-2" /> Add New User
                </button>
            </div>
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">ID/Email</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Name</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Role</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Status</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <div className="font-medium">{user.id}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </td>
                                <td className="py-3 px-4">{user.name}</td>
                                <td className="py-3 px-4"><span className={`capitalize px-2 py-1 text-xs rounded-full ${user.role === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{user.role}</span></td>
                                <td className="py-3 px-4"><span className={`capitalize px-2 py-1 text-xs rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.status}</span></td>
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

export default UserManagementPage;