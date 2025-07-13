// src/pages/DashboardPage.jsx

import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import styles from '../App.module.css';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate(); // 初始化 navigate

  // 点击卡片时，直接导航到报告页
  const handleCardClick = (studentId) => {
    if (studentId) {
      navigate(`/report/${studentId}`);
    } else {
      // 可以在这里加一个错误提示，比如使用 react-toastify
      alert("无法获取用户信息，请重新登录。");
    }
  };

  return (
    <div className={styles.dashboardGrid}>
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
};

export default DashboardPage;