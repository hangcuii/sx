// src/context/AuthContext.jsx

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId === null) {
      return null;
    }
    const parsedId = parseInt(storedUserId, 10);
    return isNaN(parsedId) ? null : parsedId;
  });

  useEffect(() => {
    if (userId !== null) { // 检查是否不为 null
      localStorage.setItem('userId', userId); // localStorage 会自动将 number 转为 string
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  const login = (userData) => {
    if (userData && userData.userid) {
      const numericId = parseInt(userData.userid, 10);
      if (!isNaN(numericId)) {
        setUserId(numericId);
      }
    }
  };

  const logout = () => {
    setUserId(null);
  };

  // 使用更安全的 isAuthenticated 判断方式
  const isAuthenticated = userId !== null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};