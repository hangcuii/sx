// src/App.jsx

import { useState } from 'react';
// 导入 CSS Modules，styles 是一个包含了所有类名的对象
import styles from './App.module.css';

function App() {
  const [view, setView] = useState('dashboard');
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  const handleCardClick = async (studentId) => {
    setView('loading');
    setError(null);

    try {
      const response = await fetch(`api/student/${studentId}/learningBehavior`);
      const data = await response.json();
      if (data.error || !response.ok) {
        throw new Error(data.error || '获取数据失败');
      }
      setReportData(data);
      setView('report');
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.message);
      setView('error');
    }
  };

  const handleBackToPortal = () => {
    setView('dashboard');
    setReportData(null);
    setError(null);
  };

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return <p style={{ textAlign: 'center', fontSize: '1.5rem' }}>正在加载分析报告...</p>;

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
            <button id="back-to-portal-btn" className={styles['back-to-portal-btn']} onClick={handleBackToPortal}>
              返回门户
            </button>
          </div>
        );

      case 'error':
        return (
          <div style={{ textAlign: 'center', color: 'red' }}>
            <h2>加载失败</h2>
            <p>{error}</p>
            <button className={styles['back-to-portal-btn']} onClick={handleBackToPortal}>
              返回门户
            </button>
          </div>
        );

      case 'dashboard':
      default:
        return (
          <div className={styles['dashboard-grid']}>
            <div
              id="learning-behavior-card"
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
    <>
      <header>
        <h1>智能化在线教学支持服务平台大数据分析系统</h1>
        <p className={styles.subtitle}>洞察教学数据，赋能智慧教育</p>
      </header>

      <main id="content-area">
        {renderContent()}
      </main>

      <footer>
        <p> All Rights Reserved.</p>
      </footer>
    </>
  );
}

export default App;