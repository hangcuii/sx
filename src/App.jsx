// src/App.jsx

import { Routes, Route, useNavigate } from 'react-router-dom';
import styles from './App.module.css';
import { useAuth } from './context/AuthContext';

// 导入所有需要的页面和组件
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ChangeUsernamePage from './pages/ChangeUsernamePage';
import ProtectedRoute from './components/ProtectedRoute';
import RootRedirector from './components/RootRedirector';
import PersonalCenterPage from './pages/PersonalCenterPage';
import BindStudentPage from './pages/BindStudentPage';
import BindTeacherPage from './pages/BindTeacherPage';
import TeachingResourcePage from './pages/TeachingResourcePage';
import LearningCenterPage from './pages/LearningCenterPage';
import StudentAnalysisReportPage from './pages/StudentAnalysisReportPage';
import StudentCenterPage from "./pages/StudentCenterPage.jsx";
import StudentBehaviorAnalysisPage from "./pages/StudentBehaviorAnalysisPage.jsx";
import StudentPortraitPage from "./pages/StudentPortraitPage.jsx";
import TeacherCenterPage from "./pages/TeacherCenterPage.jsx";
import TeacherPortraitPage from "./pages/TeacherPortraitPage.jsx";
import UserDeletionPage from './pages/UserDeletionPage';



function App() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const renderHeader = () => (
    <header className={styles.header}>
      <h1>智能化在线教学支持服务平台大数据分析系统</h1>
      <div className={styles.headerContainer}>
        <p className={styles.subtitle}>洞察教学数据，赋能智慧教育</p>


        {isAuthenticated && (
            <div className={styles.headerActions}>


                <button
                    onClick={() => navigate('/student-center')}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                >
                    <i className="fas fa-graduation-cap" style={{marginRight: '8px'}}></i>
                    学生中心
                </button>

                <button
                    onClick={() => navigate('/teacher-center')}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                >
                    <i className="fas fa-graduation-cap" style={{marginRight: '8px'}}></i>
                    教师中心
                </button>


                <button
                    onClick={() => navigate('/learning-center')}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                >
                    <i className="fas fa-graduation-cap" style={{marginRight: '8px'}}></i>
                    学习中心
                </button>

                <button
                    onClick={() => navigate('/personal-center')}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                >
                    <i className="fas fa-user-cog" style={{marginRight: '8px'}}></i>
                    个人中心
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

                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/" element={<RootRedirector/>}/>

                    <Route element={<ProtectedRoute/>}>

                        <Route path="/dashboard" element={<DashboardPage/>}/>
                        <Route path="/change-password" element={<ChangePasswordPage/>}/>
                        <Route path="/change-username" element={<ChangeUsernamePage />} />
                        <Route path="/personal-center" element={<PersonalCenterPage />} />
                        <Route path="/bind-student" element={<BindStudentPage />} />
                        <Route path="/bind-teacher" element={<BindTeacherPage />} />
                        <Route path="/teaching-resources" element={<TeachingResourcePage />} />
                        <Route path="/learning-center" element={<LearningCenterPage />} />
                        <Route path="/student-analysis-report" element={<StudentAnalysisReportPage />} />
                        <Route path="/student-center" element={<StudentCenterPage />} />
                        <Route path="/student-behavior-report" element={<StudentBehaviorAnalysisPage />} />
                        <Route path="/student-portrait" element={<StudentPortraitPage />} />
                        <Route path="/teacher-center" element={<TeacherCenterPage />} />
                        <Route path="/teacher-portrait" element={<TeacherPortraitPage />} />
                        <Route path="/delete-account" element={<UserDeletionPage />} />



          </Route>
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