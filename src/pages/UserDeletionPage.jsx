// src/pages/UserDeletionPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../App.module.css';
import { useAuth } from '../context/AuthContext';
import { deleteUser as deleteUserApi } from '../services/api';

const UserDeletionPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationInput, setConfirmationInput] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();


    const confirmValue = String( user?.userId);
    if (confirmationInput.trim() !== confirmValue) {
      setError(`确认失败，请输入正确的ID "${confirmValue}" 以继续。`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await deleteUserApi({ userId: user.userId });
      alert('您的账户已成功注销。感谢您的使用。');
      logout();
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || '注销操作失败，请重试。';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 如果无法获取用户信息，则显示错误
  if (!user || !user.userId) {
    return (
      <div className={styles.formContainer}>
        <h2>错误</h2>
        <p>无法获取当前用户信息，无法进行注销操作。</p>
        <button onClick={() => navigate('/personal-center')} className={`${styles.btn} ${styles.btnSecondary}`}>
          返回个人中心
        </button>
      </div>
    );
  }

  return (
    <div className={styles.formContainer} style={{ maxWidth: '600px', borderColor: 'var(--color-danger)' }}>
      <h2 style={{ color: 'var(--color-danger)' }}>注销账户</h2>

      <div style={{ textAlign: 'left', marginBottom: '2rem', padding: '1rem', background: 'rgba(220, 53, 69, 0.1)', borderRadius: 'var(--border-radius)' }}>
        <p><strong>警告：这是一个不可逆的操作！</strong></p>
        <p>注销账户将永久删除您的所有数据，包括登录凭证、绑定的学生/教师信息等。此操作无法撤销，请谨慎操作。</p>
      </div>

      <form onSubmit={handleSubmit}>
        <p style={{ textAlign: 'left' }}>
          为确认此操作，请输入您的ID： <strong>{user.userId}</strong>
        </p>
        <div className={styles.inputGroup}>
          <i className={`fas fa-exclamation-triangle ${styles.inputIcon}`}></i>
          <input
            type="text"
            id="confirmation"
            className={styles.inputField}
            placeholder="在此输入以确认"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            required
          />
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="button"
            onClick={() => navigate('/personal-center')}
            className={`${styles.btn} ${styles.btnSecondary}`}
            disabled={isLoading}
          >
            取消
          </button>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnDanger}`}
            style={{ flexGrow: 1 }}
            disabled={isLoading}
          >
            {isLoading ? '正在处理...' : '我已了解风险，确认注销'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDeletionPage;