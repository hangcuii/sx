/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const getInitialUser = () => {
  try {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // login 函数现在接收后端返回的原始数据对象
  const login = (backendUserData) => {
    // --- 这里是核心修改 ---
    // 从后端数据构建内部的 user 对象，并确保所有 ID 都是整数

    const newUserId = parseInt(backendUserData.userId || backendUserData.userid, 10);

    // 增加一个健壮性检查，以防后端返回无效的 userId
    if (isNaN(newUserId)) {
      console.error("Login Error: Invalid userId received from backend.", backendUserData);
      // 在这种情况下，我们不应该设置用户，以避免应用出错
      return;
    }

    const newUser = {
      userId: newUserId,
      studentId: backendUserData.studentId != null ? parseInt(backendUserData.studentId, 10) : null,
      teacherId: backendUserData.teacherId != null ? parseInt(backendUserData.teacherId, 10) : null,
    };

    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserStudentId = useCallback((newStudentIdAsNumber) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const updatedUser = { ...currentUser, studentId: newStudentIdAsNumber };
      return updatedUser;
    });
  }, []);

  const updateUserTeacherId = useCallback((newTeacherIdAsNumber) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const updatedUser = { ...currentUser, teacherId: newTeacherIdAsNumber };
      return updatedUser;
    });
  }, []);

  const isAuthenticated = !!user;
  const value = { user, isAuthenticated, login, logout, updateUserStudentId ,updateUserTeacherId};

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};