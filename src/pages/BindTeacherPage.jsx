// src/pages/BindTeacherPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../App.module.css';
import { useAuth } from '../context/AuthContext';
import {bindTeacher as bindTeacherApi, } from '../services/api';
import { useNumericInput } from '../hooks/useNumericInput';

const BindTeacherPage = () => {
  const teacherIdInput = useNumericInput('');
  const [teacherId, setTeacherId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, updateUserTeacherId } = useAuth(); // 从 AuthContext 获取 user 对象和更新函数
  const navigate = useNavigate();


    const errorMessages = {
    'User not found': '用户不存在。',
    'Missing parameters': '提交的信息不完整，请检查。',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedId = teacherIdInput.value.trim();
    if (!teacherId.trim()) {
      setError('教师ID不能为空');
      return;
    }

    const teacherIdAsNumber = parseInt(trimmedId, 10);
    if (isNaN(teacherIdAsNumber)) {
      setError('请输入有效的教师ID（仅包含数字）。');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await bindTeacherApi({ userId: user.userId, teacherId: teacherIdAsNumber });
      updateUserTeacherId(teacherIdAsNumber);
      alert('教师信息绑定成功！');
      navigate('/dashboard');
    } catch (err) {
      const backendError = err.response?.data?.error;
      const displayError = errorMessages[backendError] || backendError || '登录失败，请重试。';
      setError(displayError);
    } finally {
      setIsLoading(false);
    }
  };


  if (user && user.teacherId) {
    return (
      <div className={styles.formContainer}>
        <h2>教师信息</h2>
        <p>您已成功绑定教师ID: <strong>{user.teacherId}</strong></p>
        <p>如需修改，请联系管理员。</p>
        <Link to="/dashboard" className={`${styles.btn} ${styles.btnSecondary}`}>
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <h2>绑定教师信息</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <i className={`fas fa-id-card ${styles.inputIcon}`}></i>
          <input
              type="number"
              id="teacherId"
              className={styles.inputField}
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              placeholder="请输入您的教师ID"
              required

              onKeyDown={(e) => {
                const allowedKeys = [
                  "Backspace", "Delete", "Tab", "Escape", "Enter",
                  "ArrowLeft", "ArrowRight", "Home", "End"
                ];

                if (allowedKeys.includes(e.key)) {
                  return;
                }
                if ((e.key === 'a' || e.key === 'A') && (e.ctrlKey || e.metaKey)) {
                  return;
                }
                if (!/^[0-9]$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
          />
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <button type="submit" className={styles.btn} disabled={isLoading}>
          {isLoading ? '正在绑定...' : '确认绑定'}
        </button>
      </form>
      <Link to="/dashboard" className={`${styles.btn} ${styles.btnSecondary}`} style={{marginTop: '1rem'}}>
        稍后绑定
      </Link>
    </div>
  );
};

export default BindTeacherPage;