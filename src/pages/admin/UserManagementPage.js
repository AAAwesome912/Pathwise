import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, XCircle, AlertCircle, Search } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
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
  const [status, setStatus] = useState(user.status);
  
  // Conditionally initialize state for role-specific fields
  const [course, setCourse] = useState(user.role === 'student' ? user.course || '' : '');
  const [office, setOffice] = useState(user.role === 'staff' ? user.office || '' : '');
  const [windowNo, setWindowNo] = useState(user.role === 'staff' ? user.windowNo || '' : '');
  
  // State for the new password and its confirmation
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match if a new password is being set
    if (newPassword && newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    // Build the data object to send to the backend
    const updatedData = { name, status };
    if (newPassword) {
      updatedData.password = newPassword;
    }
    
    // Conditionally add role-specific data
    if (user.role === 'student') {
      updatedData.course = course;
    } else if (user.role === 'staff') {
      updatedData.office = office;
      updatedData.windowNo = windowNo;
    }

    // Call the onSave function from the parent with the updated data
    onSave(user.id, updatedData);
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

            {/* Conditionally rendered fields based on user role */}
            {user.role === 'student' && (
              <div className="sm:col-span-2">
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course</label>
                  <select name="course" value={course} onChange={(e) => setCourse(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                    <option value="">Select Course</option>
                    <option value="BS InfoTech">BS InfoTech</option>
                    <option value="BSEMC">BSEMC</option>
                    <option value="BSIS">BSIS</option>
                    <option value="BSA">BSA</option>
                    <option value="BSCE">BSCE</option>
                    <option value="BTVTED">BTVTED</option>
                    <option value="BSIT">BSIT</option>
                    <option value="BSHM">BSHM</option>
                  </select>
                </div>
            )}
            
            {user.role === 'staff' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Office</label>
                  <input
                    type="text"
                    value={office}
                    onChange={(e) => setOffice(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Window Number</label>
                  <input
                    type="text"
                    value={windowNo}
                    onChange={(e) => setWindowNo(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}

            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700">New Password (optional)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError('');
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError('');
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
              )}
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

// New confirmation modal component
const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => (
  <ModalPortal>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 font-sans">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition">
            <XCircle size={20} />
          </button>
        </div>
        <div className="mt-4 flex items-start">
          <AlertCircle size={24} className="text-red-500 mr-3 mt-1 flex-shrink-0" />
          <p className="text-gray-700">{message}</p>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
);

const UserManagementPage = () => {
   const navigate = useNavigate();
  // We'll use a placeholder for the authentication token.
  const authToken = "YOUR_AUTH_TOKEN_HERE";
 
  // State to manage the users data fetched from the API
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for search and filter functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // State to manage the edit modal's visibility and the user being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // New state for delete confirmation
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Function to fetch users from the backend
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
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearchTerm = searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearchTerm && matchesRole;
  });

  // Handler functions for API interactions
  const handleSaveEdit = async (userIdToUpdate, updatedData) => {
    try {
      await axios.put(`/api/admin/profile/${userIdToUpdate}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log(`User ${userIdToUpdate} updated successfully via API.`);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(`/api/admin/profile/${userToDelete.id}`, { 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('User deleted successfully.');
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsConfirmModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setUserToDelete(null);
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
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Role filter dropdown */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="block w-full sm:w-40 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>
        </div>
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
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
                      <button onClick={() => handleDeleteClick(user)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
          <button
                onClick={() => navigate('/admin')}
                className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150"
            >
                Back to Dashboard
            </button>

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={handleSaveEdit}
          onClose={handleCloseEditModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isConfirmModalOpen && userToDelete && (
        <ConfirmationModal
          title="Delete User"
          message={`Are you sure you want to delete user ${userToDelete.name}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
