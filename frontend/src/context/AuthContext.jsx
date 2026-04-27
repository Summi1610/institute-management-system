import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const parseJwtPayload = (token) => {
  try {
    const base64Payload = token.split('.')[1];
    if (!base64Payload) {
      return null;
    }

    const normalized = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), '=');
    return JSON.parse(window.atob(padded));
  } catch (error) {
    return null;
  }
};

const isTokenValid = (token) => {
  if (!token) {
    return false;
  }

  const payload = parseJwtPayload(token);
  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 > Date.now();
};

const normalizeUser = (user) => {
  if (!user) {
    return user;
  }

  return {
    ...user,
    isApproved: user.isApproved ?? user.approved ?? false
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedUser && isTokenValid(storedToken)) {
      setUser(normalizeUser(JSON.parse(storedUser)));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }

    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await api.post('/auth/signin', { username, password });
    const { token, ...rawUserData } = response.data;
    const userData = normalizeUser(rawUserData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
