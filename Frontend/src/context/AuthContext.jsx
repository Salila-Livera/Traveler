// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { login as doLogin, logout as doLogout } from '../services/authService';

export const AuthContext = createContext({
  userId: null,
  token: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [token, setToken]   = useState(null);

  // On mount, rehydrate from localStorage and set Axios header
  useEffect(() => {
    const storedId    = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');
    if (storedId && storedToken) {
      setUserId(storedId);
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  // Wrap the login service to update context & storage
  const login = async (creds) => {
    // doLogin returns { token, userId }
    const { token: newToken, userId: newUserId } = await doLogin(creds);

    // Persist
    localStorage.setItem('token', newToken);
    localStorage.setItem('userId', newUserId);

    // Update state & Axios header
    setToken(newToken);
    setUserId(newUserId);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    
    return newUserId;
  };

  const logout = () => {
    doLogout(); // clears storage + Axios header in authService
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        token,
        isAuthenticated: Boolean(token),
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
