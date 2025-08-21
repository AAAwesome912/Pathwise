import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, XCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import axios from '../../utils/axiosInstance';

// A portal component for modals. This ensures the modal is rendered outside the main
// component tree, which is a best practice for accessibility and styling.
const ModalPortal = ({ children }) => {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    const newModalRoot = document.createElement('div');
    newModalRoot.id = 'modal-root';
    document.body.appendChild(newModalRoot);
    return createPortal(children, newModalRoot);
  }
  return createPortal(children, modalRoot);
};

// A modal component for editing a user
const EditUserModal = ({ user, onSave, onClose }) => {
  // State to manage the form data, initialized with the user's current values
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onSave function from the parent with the updated data
    onSave(user.id, { name, email, role, status });
    onClose(); // Close the modal
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 font-sans">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Edit User</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <XCircle size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};

const UserManagementPage = () => {
  // We'll use a placeholder for the authentication token.
  // In a real app, this would be retrieved after user login.
  const authToken = "YOUR_AUTH_TOKEN_HERE"; // Replace with a valid token

  // State to manage the users data fetched from the API
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to manage the edit modal's visibility and the user being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Function to fetch users from the backend using axios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users', { 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      setUsers(response.data.users);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      // Axios error objects can have different structures, so we check for response data
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handler functions for API interactions
  const handleSaveEdit = async (userIdToUpdate, updatedData) => {
    try {
      await axios.put(`/api/admin/users/${userIdToUpdate}`, updatedData, { // ⬅️ Using the full URL here
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log(`User ${userIdToUpdate} updated successfully via API.`);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteUser = async (userIdToDelete) => {
    try {
      await axios.delete(`/api/admin/users/${userIdToDelete}`, { 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      console.log('User deleted successfully.');
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl font-sans min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
      </div>

      {loading && <div className="text-center py-8 text-gray-500">Loading users...</div>}
      {error && <div className="text-center py-8 text-red-500 font-medium">Error: {error}</div>}

      {!loading && !error && (
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
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800 break-words">{user.id}</div>
                      <div className="text-xs text-gray-500 break-words">{user.email}</div>
                    </td>
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">
                      <span className={`capitalize px-2 py-1 text-xs rounded-full ${user.role === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`capitalize px-2 py-1 text-xs rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button onClick={() => handleEditClick(user)} className="text-blue-500 hover:text-blue-700">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={handleSaveEdit}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
