import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();
const BASE_URL = 'http://192.168.101.18:3001';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [pageNavigationProps, setPageNavigationProps] = useState({});

  const redirectToDashboard = (role) => {
    switch (role) {
      case 'student': return setCurrentPage('studentDashboard');
      case 'staff': return setCurrentPage('staffDashboard');
      case 'admin': return setCurrentPage('adminDashboard');
      case 'visitor': return setCurrentPage('visitorDashboard');
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

        response = await axios.post(`${BASE_URL}/api/auth/login`, {
          role, name, address, contact
        });
      } else {
        response = await axios.post(`${BASE_URL}/api/auth/login`, {
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
        await axios.post(`${BASE_URL}/api/auth/logout`, { id: user.id });
      }
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setCurrentPage('login');
      toast.info("👋 You have been logged out.");
    }
  };

  const register = (userData) => {
    console.log('Registering user:', userData);
  };

  const navigate = (page, props = {}) => {
    setPageNavigationProps(props);
    setCurrentPage(page);
  };

  // ✅ Auto-login when app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      axios.get(`${BASE_URL}/api/auth/verify-token`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          redirectToDashboard(userData.role);
          toast.success(`🔓 Welcome back, ${userData.role}!`);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          toast.warn('⚠️ Session expired. Please log in again.');
          navigate('/login'); 
        });
    }
  }, []);

  // Redirect logic based on current state
  useEffect(() => {
    if (user && currentPage === 'login') {
      redirectToDashboard(user.role);
    } else if (!user && !['login', 'register'].includes(currentPage)) {
      setCurrentPage('login');
    }
  }, [user, currentPage]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, currentPage, navigate, pageNavigationProps }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
