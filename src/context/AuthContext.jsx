import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Read token from localStorage on mount
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('token');
    // Auto-clear stale mock tokens from old MVP sessions
    if (stored === 'mock_jwt_token_123') {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      return null;
    }
    return stored;
  });

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ 
        email: localStorage.getItem('userEmail') || 'user@example.com', 
        name: localStorage.getItem('userName') || 'Designer',
        role: 'USER' 
      });
    } else {
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, refresh_token, full_name } = response.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('userEmail', email);
    
    if (full_name) {
      localStorage.setItem('userName', full_name);
    } else {
      // Capitalize name from email prefix as a fallback name
      const defaultName = email.split('@')[0]
        .split(/[\._-]/)
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
      localStorage.setItem('userName', defaultName);
    }
    
    setToken(access_token);
  };

  const signup = async (email, password, full_name = '') => {
    await api.post('/auth/signup', { email, password, full_name });
    localStorage.setItem('userName', full_name);
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
