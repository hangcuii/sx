// src/pages/LearningCenterPage.jsx

import React from 'react';
import { Link ,useNavigate } from 'react-router-dom'; // 确保 Link 被导入
import styles from '../App.module.css';

const LearningCenterPage = () => {
    const navigate = useNavigate();
  return (
      <div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h2 style={{margin: 0}}>学习中心</h2>
              <button
                  onClick={() => navigate('/dashboard')}
                  className={`${styles.btn} ${styles.btnSecondary}`}
              >
                  返回仪表盘
              </button>
          </div>

          <div className={styles.dashboardGrid}>

              <Link to="/student-analysis-report" className={styles.card}>
                  <i className="fas fa-chart-line"></i>
                  <h3>学情分析报告</h3>
                  <p>查看您的个人学习行为与表现。</p>
              </Link>


              <Link to="/teaching-resources" className={styles.card}>
                  <i className="fas fa-book-open-reader"></i>
                  <h3>教学资源分析</h3>
                  <p>探索与分析平台提供的教学资源。</p>
              </Link>
          </div>
      </div>
  );
};

export default LearningCenterPage;