import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [pageNavigationProps, setPageNavigationProps] = useState({});

  const login = (credentials) => {
    const { email, password, role, name, address, contact } = credentials;

    if (role === 'visitor') {
      if (name && address && contact) {
        const mockUser = { role: 'visitor', name, address, contact };
        setUser(mockUser);
        setCurrentPage('visitorDashboard');
        return true;
      }
      return false;
    } else {
      if (email && password) {
        const mockUser = { email, role };
        setUser(mockUser);
        switch (role) {
          case 'student': setCurrentPage('studentDashboard'); break;
          case 'staff': setCurrentPage('staffDashboard'); break;
          case 'admin': setCurrentPage('adminDashboard'); break;
          default: setCurrentPage('login');
        }
        return true;
      }
      return false;
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
