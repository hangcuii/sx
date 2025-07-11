// src/pages/DashboardPage.jsx

import { useState } from 'react';
import styles from '../App.module.css'; // 我们仍然可以复用 App.module.css
import { getStudentLearningBehavior } from '../services/api'; // 使用我们封装的 API

// 导入 Loading 和 Error 组件，让代码更清晰
import Loading from '../components/Loading';
import Error from '../components/Error';

const DashboardPage = () => {
  // 你原来的所有状态都移到这里
  const [view, setView] = useState('dashboard');
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  // 你原来的 handleCardClick 函数
  const handleCardClick = async (studentId) => {
    setView('loading');
    setError(null);

    try {
      const response = await getStudentLearningBehavior(studentId);
      // 使用封装的axios后，数据在 response.data
      setReportData(response.data);
      setView('report');
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.response?.data?.message || '获取数据失败');
      setView('error');
    }
  };

  // 你原来的 handleBackToPortal 函数
  const handleBackToPortal = () => {
    setView('dashboard');
    setReportData(null);
    setError(null);
  };

  // 你原来的 renderContent 函数现在是这个组件的主要返回内容
  // 名字可以改得更通用一些，比如 renderView
  const renderView = () => {
    switch (view) {
      case 'loading':
        return <Loading />; // 使用组件

      case 'report':
        return (
          <div className={styles['report-container']}>
            <h1>学习行为分析报告</h1>
            <div className={styles['report-card']}>
              <p className={styles['data-label']}>总学习时长</p>
              <p className={styles['data-value']}>
                {reportData.learningHour} <span>小时</span>
              </p>
            </div>
            {/* 你可以添加更多报告内容的渲染 */}
            <button className={styles['back-to-portal-btn']} onClick={handleBackToPortal}>
              返回门户
            </button>
          </div>
        );

      case 'error':
        // 使用 Error 组件
        return <Error message={error} onRetry={handleBackToPortal} />;

      case 'dashboard':
      default:
        return (
          <div className={styles['dashboard-grid']}>
            <div
              className={styles.card}
              data-studentid="101"
              style={{ cursor: 'pointer' }}
              onClick={() => handleCardClick(101)}
            >
              <i className="fas fa-chart-line"></i>
              <h2>学习行为分析</h2>
              <p>点击查看ID为101的学生的学习行为分析。</p>
            </div>
            {/* <a> 标签也使用 styles.card */}
            <a href="#" className={styles.card}>
              <i className="fas fa-book-open-reader"></i>
              <h2>教学资源分析</h2>
              <p>功能待开发...</p>
            </a>
          </div>
        );
    }
  };

  return (
    // 返回视图渲染结果
    renderView()
  );
};

export default DashboardPage;