import React, { useState, useContext, createContext, useCallback } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);          // null | { email, role }
  const [page, setPage] = useState('login');       // simple pseudo‑router

  /* ------------ auth helpers ------------ */
  const login = (email, password, role) => {
    if (!email || !password) return false;
    const mockUser = { email, role };
    setUser(mockUser);
    setPage(
      role === 'student'
        ? 'studentDashboard'
        : role === 'staff'
        ? 'staffDashboard'
        : 'adminDashboard'
    );
    return true;
  };

  const register = (form) => console.log('registering', form); // TODO hook to API
  const logout   = () => { setUser(null); setPage('login'); };

  /* ------------ simple navigate() ------------ */
  const navigate = useCallback((name, state = {}) => {
    // keep shape consistent: either string or { name, ...state }
    setPage(typeof name === 'string' ? name : { ...name, ...state });
  }, []);

  return (
    <AuthContext.Provider value={{ user, page, login, register, logout, navigate }}>
      {children}
    </AuthContext.Provider>
  );
};
