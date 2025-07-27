import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
    name: '',
    address: '',
    contact: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (formData.role === 'visitor') {
        const { name, address, contact } = formData;

        if (!name || !address || !contact) {
          setError('Please fill out all visitor fields.');
          return;
        }

        const response = await axios.post('http://localhost:3001/api/visitor-login', {
          name,
          address,
          contact,
        });

        alert(`Welcome, ${response.data.user.name}!`);
        navigate('/visitorDashboard');
      } else {
        const { email, password, role } = formData;

        if (!email || !password) {
          setError('Email and password are required.');
          return;
        }

        const response = await axios.post('http://localhost:3001/api/login', { email, password, role });
        const user = response.data.user;

        alert(`Welcome, ${user.name}!`);

        if (user.role === 'admin') {
          navigate('/adminDashboard');
        } else if (user.role === 'staff') {
          navigate('/staffDashboard');
        } else if (user.role === 'student') {
          navigate('/studentDashboard');
        }
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login">
      <h2>Sign In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
            <option value="visitor">Visitor</option>
          </select>
        </div>

        {formData.role === 'visitor' ? (
          <>
            <div>
              <label>Full Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Contact:</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Login;
