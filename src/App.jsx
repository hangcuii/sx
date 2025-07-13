// src/App.jsx

import { Routes, Route, useNavigate } from 'react-router-dom';
import styles from './App.module.css';
import { useAuth } from './context/AuthContext';

// 导入所有需要的页面和组件
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ProtectedRoute from './components/ProtectedRoute';
import RootRedirector from './components/RootRedirector';
import ChangeUsernamePage from "./pages/ChangeUsernamePage.jsx";
import ReportPage from "./pages/ReportPage.jsx";

function App() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderHeader = () => (
    <header className={styles.header}>
      <h1>智能化在线教学支持服务平台大数据分析系统</h1>
      <div className={styles.headerContainer}>
        <p className={styles.subtitle}>洞察教学数据，赋能智慧教育</p>
        {isAuthenticated && (
            <div className={styles.headerActions}>
                <button
                    onClick={() => navigate('/change-password')}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                >
                    修改密码
                </button>
                <button
                    onClick={() => navigate('/change-username')}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                >
                    修改用户名
                </button>
                <button
                    onClick={handleLogout}
                    className={`${styles.btn} ${styles.btnDanger}`}
                >
                    登出
                </button>
            </div>
        )}
      </div>
    </header>
  );

    return (
        <>
            {renderHeader()}
            <main id="content-area" className={styles.container}>
                <Routes>
                    {/* 公共路由 */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/" element={<RootRedirector />} />

          {/* 受保护的路由 */}
          <Route element={<ProtectedRoute />}>
          <Route path="/change-username" element={<ChangeUsernamePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/report/:studentId" element={<ReportPage />} />
          </Route>

          {/* 404 页面 */}
          <Route path="*" element={<h2>404: 页面未找到</h2>} />
        </Routes>
      </main>
      <footer className={styles.footer}>
        <p>All Rights Reserved.</p>
      </footer>
    </>
  );
}

export default App;