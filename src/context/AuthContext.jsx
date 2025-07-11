// src/context/AuthContext.jsx

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 我们现在存储 userid 而不是 token
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  // login 函数现在只负责设置 userId
  const login = (userData) => {
    // userData 是 { userid: '...' }
    setUserId(userData.userid);
  };

  const logout = () => {
    setUserId(null);
  };

  // isAuthenticated 的逻辑不变，只是判断的变量变了
  const isAuthenticated = !!userId;

  // 我们需要把 userId 暴露出去，以便后续 API 请求使用
  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};