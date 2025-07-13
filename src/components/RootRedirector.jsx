import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage'; // 引入登录页

const RootRedirector = () => {
  const { isAuthenticated, userId } = useAuth();


  if (isAuthenticated && userId) {
    return <Navigate to={`/dashboard`} replace />;
  }

  return <LoginPage />;
};

export default RootRedirector;