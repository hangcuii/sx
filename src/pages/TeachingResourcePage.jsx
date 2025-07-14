// src/pages/TeacherPortraitPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../App.module.css';

const TeachingResourcePage = () => {
  return (
    <div className={styles.formContainer}>
      <h2>教学资源分析</h2>
      <p style={{ color: 'var(--color-text-light)', margin: '2rem 0' }}>此功能正在开发中...</p>
      <Link to="/dashboard" className={`${styles.btn} ${styles.btnSecondary}`}>
        返回仪表盘
      </Link>
    </div>
  );
};

export default TeachingResourcePage;