// src/pages/StudentAnalysisReportPage.jsx

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../App.module.css';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { getStudentLearningBehavior } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StudentAnalysisReportPage = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReportData = useCallback(async () => {
    // 确保 userId 存在，否则不发起请求
    if (!userId) {
      setError("无法获取用户信息，请重新登录。");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await getStudentLearningBehavior(userId); // 使用当前用户的 ID
      if (response && response.data && typeof response.data === 'object') {
        setReportData(response.data);
      } else {
        throw new Error("未能获取有效的报告数据格式。");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || '获取报告数据失败，请稍后重试。';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={fetchReportData} />;
  }

  if (!reportData) {
    return <Error message="未能加载报告数据。" onRetry={fetchReportData} />;
  }

  return (
    <div className={styles.reportContainer}>
      <h1>学情分析报告</h1>
      <p style={{textAlign: 'center', color: 'var(--color-text-light)', marginTop: '-1rem', marginBottom: '2rem'}}>
        当前用户ID: {reportData.studentId}
      </p>

      <div className={styles.reportCard}>
        <p className={styles.dataLabel}>总学习时长</p>
        <p className={styles.dataValue}>
          {reportData.learningHour} <span>小时</span>
        </p>
      </div>

      <button
        className={`${styles.btn} ${styles.btnSecondary}`}
        onClick={() => navigate('/learning-center')} // 返回到学习中心
      >
        返回学习中心
      </button>
    </div>
  );
};

export default StudentAnalysisReportPage;