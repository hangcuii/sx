// src/pages/StudentBehaviorAnalysisPage.jsx (修改版)

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentBehaviorAnalysis } from '../services/api';
import styles from '../App.module.css';
import Loading from '../components/Loading';

const StudentBehaviorAnalysisPage = () => {
  const { user } = useAuth();

  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 检查用户是否登录并绑定了学生身份
    if (!user || !user.studentId) {
      setIsLoading(false);
      setError("请先绑定您的学生身份以查看学习行为分析。");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await studentBehaviorAnalysis({ userId: user.userId });

        setAnalysisData(response.data);

      } catch (err) {
        console.error("获取学习行为分析数据失败:", err);
        setError("无法加载分析数据，请稍后再试。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]); // 依赖于user

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>学生学习行为分析</h1>

      {error && <p className={styles.errorMessage} style={{ textAlign: 'center' }}>{error}</p>}

      {!isLoading && !error && analysisData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

          {/* 总学时卡片 */}
          <div className={`${styles.card}`} style={{ textAlign: 'center' }}>
            <i className="fas fa-clock" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}></i>
            <h3 className={styles.dataLabel}>总学时</h3>
            <div className={styles.dataValue}>
              {analysisData['total_time']}
              <span>小时</span>
            </div>
          </div>

          {/* 课程平均完成率卡片 */}
          <div className={`${styles.card}`} style={{ textAlign: 'center' }}>
            <i className="fas fa-check-circle" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}></i>
            <h3 className={styles.dataLabel}>课程平均完成率</h3>
            <div className={styles.dataValue}>
              {analysisData['class_complete_rate']}
              <span>%</span>
            </div>
          </div>

          {/* 教学视频完播率卡片 */}
          <div className={`${styles.card}`} style={{ textAlign: 'center' }}>
            <i className="fas fa-play-circle" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}></i>
            <h3 className={styles.dataLabel}>教学视频完播率</h3>
            <div className={styles.dataValue}>
              {analysisData['video_complete_rate']}
              <span>%</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default StudentBehaviorAnalysisPage;