// src/pages/StudentCenterPage.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../App.module.css';

const StudentCenterPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* 页面头部，包含标题和返回按钮 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>学生中心</h2>
                <button
                    onClick={() => navigate('/dashboard')}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                >
                    返回仪表盘
                </button>
            </div>

            <div className={styles.dashboardGrid}>

                {/* 卡片1: 学习行为分析 */}
                <Link to="/student-behavior-report" className={styles.card}>
                    <i className="fas fa-magnifying-glass-chart"></i>
                    <h3>学习行为分析</h3>
                    <p>查看您的个人学习行为与表现。</p>
                </Link>

                {/* 卡片2: 学生画像 */}
                <Link to="/student-portrait" className={styles.card}>
                    <i className="fas fa-user-graduate"></i>
                    <h3>学生画像</h3>
                    <p>查看您的个人学习画像。</p>
                </Link>

            </div>
        </div>
    );
};

export default StudentCenterPage;