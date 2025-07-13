// src/pages/DashboardPage.jsx

import { useState } from 'react';
import styles from '../App.module.css';
import { getStudentLearningBehavior } from '../services/api';
import { useAuth } from '../context/AuthContext';

import Loading from '../components/Loading';
import Error from '../components/Error';

const DashboardPage = () => {
  const [view, setView] = useState('dashboard');
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  const { userId } = useAuth();

  const handleCardClick = async (studentId) => {

    if (!studentId) {
      setError("无法获取当前用户信息，请重新登录。");
      setView('error');
      return;
    }

    setView('loading');
    setError(null);

    try {
      const response = await getStudentLearningBehavior(studentId);
      setReportData(response.data);
      setView('report');
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.response?.data?.message || '获取数据失败');
      setView('error');
    }
  };

  const handleBackToPortal = () => {
    setView('dashboard');
    setReportData(null);
    setError(null);
  };

  const renderView = () => {
    switch (view) {
      case 'loading':
        return <Loading />;

      case 'report':
        return (
          <div className={styles['report-container']}>
            <h1>学生ID: {reportData.studentId} 的学习行为分析报告</h1>
            <div className={styles['report-card']}>
              <p className={styles['data-label']}>总学习时长</p>
              <p className={styles['data-value']}>
                {reportData.learningHour} <span>小时</span>
              </p>
            </div>
            <button className={styles['back-to-portal-btn']} onClick={handleBackToPortal}>
              返回门户
            </button>
          </div>
        );

      case 'error':
        return <Error message={error} onRetry={handleBackToPortal} />;

      case 'dashboard':
      default:
        return (
          <div className={styles['dashboard-grid']}>
            <div
              className={styles.card}
              style={{ cursor: 'pointer' }}
              onClick={() => handleCardClick(userId)}
            >
              <i className="fas fa-chart-line"></i>
              <h2>我的学习行为分析</h2>
              <p>点击查看您（ID: {userId}）的学习行为分析报告。</p>
            </div>

            <a href="#" className={styles.card}>
              <i className="fas fa-book-open-reader"></i>
              <h2>教学资源分析</h2>
              <p>功能待开发...</p>
            </a>
          </div>
        );
    }
  };

  return renderView();
};

export default DashboardPage;