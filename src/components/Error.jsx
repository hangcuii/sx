// src/components/Error.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../App.module.css';


function Error({ message, returnPath = '/dashboard' }) {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate(returnPath); // 跳转到指定路径
  };

  return (
    <div style={{ textAlign: 'center', color: '#dc3545', padding: '50px 20px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>加载失败</h2>
      <p style={{ marginBottom: '1.5rem', color: '#6c757d' }}>{message}</p>

      <button className={styles['back-to-portal-btn']} onClick={handleReturn}>
        返回仪表盘
      </button>
    </div>
  );
}

export default Error;