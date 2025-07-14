// src/pages/PersonalCenterPage.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../App.module.css';

const PersonalCenterPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      {/* 标题和返回按钮 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>个人中心</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className={`${styles.btn} ${styles.btnSecondary}`}
        >
          返回仪表盘
        </button>
      </div>

      <div className={styles.dashboardGrid}>
        {/* 修改用户名 */}
        <Link to="/change-username" className={styles.card}>
          <i className="fas fa-user-edit"></i>
          <h3>修改用户名</h3>
          <p>更新您的账户显示名称。</p>
        </Link>

        {/* 修改密码 */}
        <Link to="/change-password" className={styles.card}>
          <i className="fas fa-key"></i>
          <h3>修改密码</h3>
          <p>定期更换密码以保障账户安全。</p>
        </Link>

        {/* 绑定学生信息 */}
        <Link to="/bind-student" className={styles.card}>
          <i className="fas fa-id-card"></i>
          <h3>绑定学生信息</h3>
          <p>关联您的学生档案。</p>
        </Link>

        {/* 绑定教师信息 */}
        <Link to="/bind-teacher" className={styles.card}>
          <i className="fas fa-chalkboard-teacher"></i>
          <h3>绑定教师信息</h3>
          <p>关联您的教师档案。</p>
        </Link>

        {/* 登出 */}
        <div
          className={styles.card}
          style={{ cursor: 'pointer' }}
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt" style={{ color: 'var(--color-danger)' }}></i>
          <h3 style={{ color: 'var(--color-danger)' }}>安全登出</h3>
          <p>退出当前账户。</p>
        </div>

        <Link to="/delete-account" className={styles.card}>
          <i className="fas fa-trash-alt" style={{ color: 'var(--color-danger)' }}></i>
          <h3 style={{ color: 'var(--color-danger)' }}>注销账户</h3>
          <p>此操作将永久删除您的账户信息。</p>
        </Link>


      </div>
    </div>
  );
};

export default PersonalCenterPage;