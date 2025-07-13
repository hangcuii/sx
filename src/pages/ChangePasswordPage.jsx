// src/pages/ChangePasswordPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword as changePasswordApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { userId,logout } = useAuth();


  const errorMessages = {
  'Invalid old password': '旧密码错误。',
  'User not found': '用户不存在。',
  'Missing parameters': '提交的信息不完整，请检查。',

    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 基础校验
    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('所有字段均为必填项');
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      setError('新密码和确认密码不匹配');
      return;
    }
    if (newPassword.trim().length < 6) {
      setError('新密码长度不能少于6位');
      return;
    }

    setIsLoading(true);

    try {
      await changePasswordApi({
        userid: userId,
        old_pwd: oldPassword,
        new_pwd: newPassword,
      });
      setSuccess('密码修改成功！您需要重新登录。');

      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);

    } catch (err) {
        const backendError = err.response?.data?.error;
        const displayError = errorMessages[backendError] || backendError || '用户名修改失败，请重试。';
        setError(displayError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>修改密码</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>旧密码:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>新密码:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>确认新密码:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
          {isLoading ? '正在提交...' : '确认修改'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;