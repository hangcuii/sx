// src/pages/ChangePasswordPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword as changePasswordApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import styles from '../App.module.css'; // 导入我们统一的样式文件

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
      setError('所有字段均为必填项。');
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      setError('新密码和确认密码不匹配。');
      return;
    }
    if (newPassword.trim().length < 6) {
      setError('新密码长度不能少于6位。');
      return;
    }

    setIsLoading(true);

    try {
      await changePasswordApi({
        userId: user.userId,
        old_pwd: oldPassword,
        new_pwd: newPassword,
      });
      setSuccess('密码修改成功！2秒后将自动登出并跳转至登录页。');

      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);

    } catch (err) {
      const backendError = err.response?.data?.error;
      const displayError = errorMessages[backendError] || backendError || '密码修改失败，请重试。';
      setError(displayError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 使用统一的 formContainer 样式
    <div className={styles.formContainer}>
      <h2>修改密码</h2>
      <form onSubmit={handleSubmit}>
        {/* 旧密码输入框 */}
        <div className={styles.inputGroup}>
          <i className={`fas fa-key ${styles.inputIcon}`}></i>
          <input
            id="oldPassword"
            type="password"
            className={styles.inputField}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="请输入旧密码"
            required
          />
        </div>

        {/* 新密码输入框 */}
        <div className={styles.inputGroup}>
          <i className={`fas fa-lock ${styles.inputIcon}`}></i>
          <input
            id="newPassword"
            type="password"
            className={styles.inputField}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="请输入新密码（至少6位）"
            required
          />
        </div>

        {/* 确认新密码输入框 */}
        <div className={styles.inputGroup}>
          <i className={`fas fa-check-circle ${styles.inputIcon}`}></i>
          <input
            id="confirmPassword"
            type="password"
            className={styles.inputField}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="请再次输入新密码"
            required
          />
        </div>

        {/* 错误和成功消息提示 */}
        {error && <p className={styles.errorMessage}>{error}</p>}
        {success && <p style={{ color: 'green', minHeight: '1.2rem', marginBottom: '1rem', fontSize: '0.9rem' }}>{success}</p>}
        {/* 如果没有错误或成功消息，则显示一个占位的空p标签，防止布局跳动 */}
        {!error && !success && <p className={styles.errorMessage}></p>}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isLoading || success} // 成功后也禁用按钮
          className={`${styles.btn} ${styles.btnPrimary} ${styles.submitButton}`}
        >
          {isLoading ? '正在提交...' : '确认修改'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;