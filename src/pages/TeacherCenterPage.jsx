// src/pages/TeacherCenterPage.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../App.module.css';

const TeacherCenterPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* 页面头部 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>教师中心</h2>
                <button
                    onClick={() => navigate('/dashboard')}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                >
                    返回仪表盘
                </button>
            </div>

            {/* 卡片网格 */}
            <div className={styles.dashboardGrid}>

                {/* 教师画像 */}
                <Link to="/teacher-portrait" className={styles.card}>
                    <i className="fas fa-person-chalkboard"></i>
                    <h3>教师画像</h3>
                    <p>查看您的个人教学画像。</p>
                </Link>



            </div>
        </div>
    );
};

export default TeacherCenterPage;