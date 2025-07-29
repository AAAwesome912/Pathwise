import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/logo';

const LoginPage = () => {
  const {login}  = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  // Frontend validation for visitor
  if (role === 'visitor') {
    if (!name || !address || !contact) {
      setError('Please complete all fields for visitor login.');
      return;
    }
  } else {
    // Frontend validation for student/staff/admin
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
  }

  const credentials = { role };
  if (role === 'visitor') {
    credentials.name = name;
    credentials.address = address;
    credentials.contact = contact;
  } else {
    credentials.email = email;
    credentials.password = password;
  }

  const result = await login(credentials);

  if (result !== true) {
    setError(result); // Show specific message from backend
    return;
  }

console.log("🟨 Submitting login data:", credentials);



  switch (role) {
    case 'student':
      navigate('/student');
      break;
    case 'staff':
      navigate('/staff');
      break;
    case 'admin':
      navigate('/admin');
      break;
    case 'visitor':
      navigate('/visitor');
      break;
    default:
      navigate('/login');
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <Logo />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to PathWise</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

          <div className="space-y-4">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="visitor">Visitor</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>

            {role === 'visitor' ? (
              <>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Email or Contact"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </>
            ) : (
              <>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </>
            )}
          </div>

          {role !== 'visitor' && (
          <div className="text-sm">
           <p className="text-center mt-4">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-600 underline cursor-pointer"
        >
          Register
        </span>
      </p>
          </div>

          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};


export default LoginPage;
