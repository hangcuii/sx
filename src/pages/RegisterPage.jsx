// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 使用 Link 组件
import { register as registerApi } from '../services/api';

// 导入 CSS Modules
import styles from '../App.module.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 添加确认密码字段
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // 前端校验
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('密码长度不能少于6位');
      setIsLoading(false);
      return;
    }

    try {
      await registerApi({ username, password });
      setSuccess('注册成功！2秒后将自动跳转到登录页面...');

      // 禁用表单，并准备跳转
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || '注册失败，用户名可能已被占用');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>创建新账户</h2>
      <form onSubmit={handleSubmit}>

        <div className={styles.inputGroup}>
          <input
            id="username"
            type="text"
            className={styles.inputField}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入用户名"
            required
            disabled={isLoading || success} // 成功后禁用输入
          />
          <i className={`fas fa-user ${styles.inputIcon}`}></i>
        </div>

        <div className={styles.inputGroup}>
          <input
            id="password"
            type="password"
            className={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码（至少6位）"
            required
            disabled={isLoading || success}
          />
          <i className={`fas fa-lock ${styles.inputIcon}`}></i>
        </div>

        <div className={styles.inputGroup}>
          <input
            id="confirmPassword"
            type="password"
            className={styles.inputField}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="请再次输入密码"
            required
            disabled={isLoading || success}
          />
          <i className={`fas fa-check-circle ${styles.inputIcon}`}></i>
        </div>

        {/* 错误或成功信息占位 */}
        {success ? (
          <p style={{ color: '#28a745', minHeight: '1.2em' }}>{success}</p>
        ) : (
          <p className={styles.errorMessage}>{error || ' '}</p>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading || success} // 正在加载或成功后都禁用按钮
        >
          {isLoading ? '注册中...' : '注 册'}
        </button>
      </form>

      <p className={styles.switchFormLink}>
        已有账号？ <Link to="/login">直接登录</Link>
      </p>
    </div>
  );
};

export default RegisterPage;