import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [pageNavigationProps, setPageNavigationProps] = useState({});

  const redirectToDashboard = (role) => {
    switch (role) {
      case 'student': return setCurrentPage('student');
      case 'staff': return setCurrentPage('staff');
      case 'admin': return setCurrentPage('admin');
      case 'visitor': return setCurrentPage('visitor');
      default: return setCurrentPage('login');
    }
  };

  const login = async (credentials) => {
    const { role, email, password, name, address, contact } = credentials;

    try {
      let response;
      if (role === 'visitor') {
        if (!name || !address || !contact) {
          throw new Error("Please complete all required fields.");
        }
        response = await axiosInstance.post('/api/auth/login', {
          role, name, address, contact
        });
      } else {
        response = await axiosInstance.post('/api/auth/login', {
          role, email, password
        });
      }

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      redirectToDashboard(userData.role);

      toast.success(`✅ Logged in as ${userData.role}`);
      return true;
    } catch (err) {
      console.error('Login error:', err.message);
      const errorMessage = err.response?.data?.message || "Login failed.";
      toast.error(`❌ ${errorMessage}`);
      return errorMessage;
    }
  };

  const logout = async () => {
    try {
      if (user?.id) {
        await axiosInstance.post('/api/auth/logout', { id: user.id });
      }
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setCurrentPage('login');
      
    }
  };

  const register = (userData) => {
    console.log('Registering user:', userData);
  };

  const navigate = (page, props = {}) => {
    setPageNavigationProps(props);
    setCurrentPage(page);
  };

  useEffect(() => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  const verifyTokenAndRedirect = async () => {
    if (token && storedUser) {
      try {
        await axiosInstance.get('/api/auth/verify-token');
        const userData = JSON.parse(storedUser);
        setUser(userData);
        redirectToDashboard(userData.role);
        toast.success(`🔓 Welcome back, ${userData.role}!`);
      } catch (error) {
        console.error('Token verification failed:', error.message);
        // Correctly handle the session expiration
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null); // ⬅️ THIS IS THE KEY CHANGE
        setCurrentPage('login'); // ⬅️ Optional, but good practice for immediate redirect
        toast.warn('⚠️ Session expired. Please log in again.');
      }
    }
  };
  verifyTokenAndRedirect();
}, []);

  useEffect(() => {
    if (user && currentPage === 'login') {
      redirectToDashboard(user.role);
    } else if (!user && !['login', 'register'].includes(currentPage)) {
      setCurrentPage('login');
    }
  }, [user, currentPage]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, register, currentPage, navigate, pageNavigationProps }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
