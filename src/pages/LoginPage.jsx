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

      if (responseData.success === 1 && responseData.userid) {
        // 登录成功
        auth.login({ userid: responseData.userid });
        navigate(`/dashboard?userid=${responseData.userid}`);;
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