// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/api';
import styles from '../App.module.css';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const errorMessages = {
    'Password incorrect': '密码错误。',
    'Username does not exist': '用户不存在，请确认账号信息。',
    'Missing parameters': '提交的信息不完整，请检查。',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginApi({ name, pwd });
      const responseData = response.data;

      if (responseData.success === 1 && responseData.userId) {
        // 登录成功
        auth.login({ userId: responseData.userId });
        navigate('/dashboard');
      } else {
        // 登录失败（但请求是成功的 200 OK），应用翻译
        const backendError = responseData.error;
        const displayError = errorMessages[backendError] || backendError || '登录失败，未知错误。';
        setError(displayError);
      }
    } catch (err) {
      const backendError = err.response?.data?.error;
      const displayError = errorMessages[backendError] || backendError || '登录失败，请重试。';
      setError(displayError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>系统登录</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <i className={`fas fa-user ${styles.inputIcon}`}></i>
          <input
            id="username"
            type="text"
            className={styles.inputField}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入用户名"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <i className={`fas fa-lock ${styles.inputIcon}`}></i>
          <input
            id="password"
            type="password"
            className={styles.inputField}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="请输入密码"
            required
          />
        </div>
        <p className={styles.errorMessage}>{error || ''}</p>
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary} ${styles.submitButton}`}
          disabled={isLoading}
        >
          {isLoading ? '登录中...' : '登 录'}
        </button>
      </form>
      <p className={styles.switchFormLink}>
        还没有账号？ <Link to="/register">立即注册</Link>
      </p>
    </div>
  );
};

export default LoginPage;