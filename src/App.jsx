// src/App.jsx

import { Routes, Route, useNavigate } from 'react-router-dom';
import styles from './App.module.css'; // 样式文件保持不变
import { useAuth } from './context/AuthContext';

// 导入所有需要的页面和组件
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ProtectedRoute from './components/ProtectedRoute';
import RootRedirector from './components/RootRedirector';

function App() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderHeader = () => (
    <header>
      <h1>智能化在线教学支持服务平台大数据分析系统</h1>
      <div className={styles.headerContainer}>
        <p className={styles.subtitle}>洞察教学数据，赋能智慧教育</p>
        {isAuthenticated && (
          <div className={styles.headerActions}>
            <button onClick={() => navigate('/change-password')} className={styles.navButton}>修改密码</button>
            <button onClick={handleLogout} className={styles.logoutButton}>登出</button>
          </div>
        )}
      </div>
    </header>
  );

  return (
    <>
      {renderHeader()}

      <main id="content-area">
        <Routes>
          {/* 公共路由 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<RootRedirector />} />

          {/* 受保护的路由 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* 404 页面 */}
          <Route path="*" element={<h2>404: 页面未找到</h2>} />
        </Routes>
      </main>

      <footer>
        <p>All Rights Reserved.</p>
      </footer>
    </>
  );
}

export default App;