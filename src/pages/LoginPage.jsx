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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {

      const response = await loginApi({ name, pwd });
      const responseData = response.data;

      if (responseData.pass === 1 && responseData.userid) {
        // 登录成功
        auth.login({ userid: responseData.userid });
        navigate(`/dashboard?userid=${responseData.userid}`);;
      } else {
        // 登录失败（但请求是成功的 200 OK）
        setError(responseData.error || '登录失败，未知错误');
      }
    } catch (err) {
      setError(err.response?.data?.error || '发生网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>系统登录</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            id="username"
            type="text"
            className={styles.inputField}
            value={name} // 绑定到 name
            onChange={(e) => setName(e.target.value)} // 更新 name
            placeholder="请输入用户名"
            required
          />
          <i className={`fas fa-user ${styles.inputIcon}`}></i>
        </div>
        <div className={styles.inputGroup}>
          <input
            id="password"
            type="password"
            className={styles.inputField}
            value={pwd} // 绑定到 pwd
            onChange={(e) => setPwd(e.target.value)} // 更新 pwd
            placeholder="请输入密码"
            required
          />
          <i className={`fas fa-lock ${styles.inputIcon}`}></i>
        </div>
        <p className={styles.errorMessage}>{error || ' '}</p>
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
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