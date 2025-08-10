import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { useAuth } from '../contexts/AuthContext';

const EditProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // State to handle the in-page message box, including the new user data
  const [message, setMessage] = useState({ text: '', type: '', updatedUser: null });

  // Initialize state with all possible fields to handle different roles
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    course: '',
    office: '',
    windowNo: '',
    section: '',
    department: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        contact: user.contact || '',
        address: user.address || '',
        course: user.course || '',
        office: user.office || '',
        windowNo: user.windowNo || '',
        section: user.section || '',
        department: user.department || '',
      });
    }
  }, [user]);

  // ✅ THIS useEffect now handles all post-success logic
  useEffect(() => {
    let timer;
    if (message.type === 'success' && message.text) {
      // Set a timer to update the user context and then navigate
      // This ensures the message has time to render before navigation
      timer = setTimeout(() => {
        // Update user context with the new data
        if (message.updatedUser) {
          setUser(message.updatedUser);
        }
        navigate('/profile');
      }, 2500); 
    }

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [message, navigate, setUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear any previous messages
    setMessage({ text: '', type: '', updatedUser: null });
    try {
      const res = await axios.put(`/api/auth/profile/${user.id}`, formData);

      if (res.data.success) {
        // Only set the success message state. The useEffect hook will handle the rest.
        setMessage({ text: 'Profile updated successfully!', type: 'success', updatedUser: res.data.user });
      } else {
        // Handle cases where success is false, but not an error
        setMessage({ text: res.data.message || 'Failed to update profile.', type: 'error', updatedUser: null });
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      // Catch network or server errors and display a message
      setMessage({ text: 'Failed to update profile.', type: 'error', updatedUser: null });
    }
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  // Helper function to get message box styles based on type
  const getMessageStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h1>
      
      {/* Conditionally rendered message box */}
      {message.text && (
        <div className={`border px-4 py-3 rounded relative mb-4 ${getMessageStyles(message.type)}`} role="alert">
          <span className="block sm:inline">{message.text}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setMessage({ text: '', type: '' })}>
            <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.841l-2.651 3.008a1.2 1.2 0 1 1-1.697-1.697l2.85-3.007-2.85-3.007a1.2 1.2 0 0 1 1.697-1.697l2.651 3.008 2.651-3.008a1.2 1.2 0 0 1 1.697 1.697l-2.85 3.007 2.85 3.007a1.2 1.2 0 0 1 0 1.697z"/>
            </svg>
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        {user.role === 'student' && (
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course</label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">-- Select Course --</option>
              <option value="BSIT">BSIT</option>
              <option value="BSInfoTech">BSInfoTech</option>
              <option value="BSIS">BSIS</option>
              <option value="BSEMC">BSEMC</option>
              <option value="BTVTED">BTVTED</option>
              <option value="BSA">BSA</option>
              <option value="BSHM">BSHM</option>
            </select>
          </div>
        )}

        {user.role === 'staff' && (
          <>
            <div>
              <label htmlFor="office" className="block text-sm font-medium text-gray-700">Office</label>
              <select
                id="office"
                name="office"
                value={formData.office}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">-- Select Office --</option>
                <option value="Registrar">Registrar</option>
                <option value="Library">Library</option>
                <option value="Departmental">Departmental</option>
              </select>
            </div>
            {formData.office === 'Registrar' && (
              <div>
                <label htmlFor="windowNo" className="block text-sm font-medium text-gray-700">Window Number</label>
                <input
                  type="text"
                  id="windowNo"
                  name="windowNo"
                  value={formData.windowNo}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            )}
            {formData.office === 'Library' && (
              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
                <input
                  type="text"
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            )}
            {formData.office === 'Departmental' && (
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            )}
          </>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
