// src/pages/BindTeacherPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../App.module.css';

const BindTeacherPage = () => {
  return (
    <div className={styles.formContainer}>
      <h2>绑定教师信息</h2>
      <p style={{ color: styles['--color-text-light'], margin: '2rem 0' }}>此功能正在开发中...</p>
      <Link to="/personal-center" className={`${styles.btn} ${styles.btnSecondary}`}>
        返回个人中心
      </Link>
    </div>
  );
};

export default BindTeacherPage;