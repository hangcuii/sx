// src/context/AuthContext.jsx

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);


   const login = (userData) => {
    if (userData && userData.userid) {
      setUserId(String(userData.userid)); // 确保存入的是字符串
    }
  };

  const logout = () => {
    setUserId(null);
  };

  const isAuthenticated = !!userId;
  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};