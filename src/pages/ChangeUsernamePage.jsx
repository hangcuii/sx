// src/pages/ChangeUsernamePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeUsername as changeUsernameApi } from '../services/api'; // 确保 API 已在 api.js 中定义和导出
import { useAuth } from '../context/AuthContext';
import styles from '../App.module.css';

const ChangeUsernamePage = () => {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const errorMessages = {
    'Duplicate username': '该用户名已被使用，请换一个试试。',
    'User not found': '用户不存在，请确认账号信息。',
    'Missing parameters': '提交的信息不完整，请检查。',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 基础校验
    if (!newName.trim()) {
      setError('新用户名不能为空。');
      return;
    }
    if (newName.trim().length < 2) {
      setError('新用户名长度不能少于2位。');
      return;
    }

    setIsLoading(true);

    try {
      const response = await changeUsernameApi({
        userId: user.userId,
        new_name: newName.trim(),
      });

      if (response.data && response.data.success === 1) {
        setSuccess('用户名修改成功！2秒后将返回仪表盘。');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        const backendError = response.data.error;
        const displayError = errorMessages[backendError] || backendError || '操作失败，未知错误。';
        setError(displayError);
      }
    } catch (err) {
      const backendError = err.response?.data?.error;
      const displayError = errorMessages[backendError] || backendError || '用户名修改失败，请重试。';
      setError(displayError);
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className={styles.formContainer}>
      <h2>修改用户名</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <i className={`fas fa-user-edit ${styles.inputIcon}`}></i>
          <input
            id="newUsername"
            type="text"
            className={styles.inputField}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="请输入新的用户名"
            required
          />
        </div>


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

export default ChangeUsernamePage;