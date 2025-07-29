import React, { createContext, useContext, useState, useEffect } from 'react';
  import axios from 'axios'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [pageNavigationProps, setPageNavigationProps] = useState({});

const login = async (credentials) => {
  const { role, email, password, name, address, contact } = credentials;

  try {
    let userData;

   if (role === 'visitor') {
  if (!name || !address || !contact) {
    throw new Error("Please complete all required fields.");
  }

  // Send visitor info to backend to be saved
  const response = await axios.post('http://localhost:3001/api/auth/login', {
    role,
    name,
    address,
    contact
  });

  userData = response.data.user;

    } else {
      // Normal login for student/staff/admin
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password,
        role
      });

      userData = response.data.user;
    }

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    // Navigate based on role
    switch (userData.role) {
      case 'student':
        setCurrentPage('/student');
        break;
      case 'staff':
        setCurrentPage('/staff');
        break;
      case 'admin':
        setCurrentPage('/admin');
        break;
      case 'visitor':
        setCurrentPage('/visitor');
        break;
      default:
        setCurrentPage('/login');
    }

    return true;
  } catch (err) {
  console.error('Login error:', err.message);
  return err.response?.data?.message || "Login failed.";

  }
};


  const register = (userData) => {
    console.log('Registering user:', userData);
  };

  const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setUser(null);
};


  const navigate = (page, props = {}) => {
    setPageNavigationProps(props);
    setCurrentPage(page);
  };

  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser && !user) {
    setUser(JSON.parse(storedUser));
  }
}, [user]); // ✅ Fixed: added 'user' to dependency array


  useEffect(() => {
    if (user && currentPage === 'login') {
      switch (user.role) {
        case 'student': setCurrentPage('studentDashboard'); break;
        case 'visitor': setCurrentPage('visitorDashboard'); break;
        case 'staff': setCurrentPage('staffDashboard'); break;
        case 'admin': setCurrentPage('adminDashboard'); break;
        default: setCurrentPage('login');
      }
    } else if (!user && currentPage !== 'login' && currentPage !== 'register') {
      setCurrentPage('login');
    }
  }, [user, currentPage]);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, currentPage, navigate, pageNavigationProps }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
