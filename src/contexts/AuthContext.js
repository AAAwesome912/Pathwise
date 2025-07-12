import React, { useState, createContext, useContext } from 'react';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');

  const login = (email, pwd, role) => {
    if (email && pwd) {
      const mockUser = { email, role };
      setUser(mockUser);
      setCurrentPage(role+'Dashboard');
      return true;
    }
    return false;
  };
  const register = (data) => {
    console.log('Register', data);
    setCurrentPage('login');
  };
  const logout = () => {
    setUser(null);
    setCurrentPage('login');
  };
  const navigate = page => setCurrentPage(page);

  return (
    <AuthContext.Provider value={{
      user, login, logout, register,
      currentPage, navigate
    }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
