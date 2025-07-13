// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 使用 Link 组件
import { register as registerApi } from '../services/api';

// 导入 CSS Modules
import styles from '../App.module.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 添加确认密码字段
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const errorMessages = {
    'Duplicate username': '该用户名已被使用，请换一个试试。',
    'Missing parameters': '提交的信息不完整，请检查。',
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // 前端校验
    if (pwd.trim() !== confirmPassword.trim()) {
      setError('两次输入的密码不一致');
      setIsLoading(false);
      return;
    }
    if (name.trim().length < 1 ||name.trim().length>16) {
      setError('用户名长度必须为1到16位');
      setIsLoading(false);
      return;
    }

    if (pwd.trim().length < 1 ||pwd.trim().length>16) {
      setError('密码长度必须为1到16位');
      setIsLoading(false);
      return;
    }

    try {
          const response = await registerApi({ name, pwd });
          const responseData = response.data;

          // 在 try 块中处理业务逻辑失败
          if (responseData.success === 1) {

            setSuccess('注册成功！2秒后将自动跳转到登录页面...');
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          } else {
            // 业务逻辑失败 (例如，用户名重复)
            // axios 认为是成功 (200 OK)，在这里处理错误
            const backendError = response.data.error;
            const displayError = errorMessages[backendError] || backendError || '操作失败，未知错误。';
            setError(displayError);
            setIsLoading(false);
          }

        } catch (err) {
          // catch 块处理网络错误和 4xx/5xx 状态码
          const backendError = err.response?.data?.error;
          const displayError = errorMessages[backendError] || backendError || '用户名修改失败，请重试。';
          setError(displayError);
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入用户名（1到16位）"
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
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="请输入密码（1到16位）"
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
          className={`${styles.btn} ${styles.btnPrimary} ${styles.submitButton}`}
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