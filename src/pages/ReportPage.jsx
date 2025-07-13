// src/pages/ReportPage.jsx

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../App.module.css';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { getStudentLearningBehavior } from '../services/api';

const ReportPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 使用 useCallback 封装数据获取逻辑，以便在 onRetry 中复用
  const fetchReportData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getStudentLearningBehavior(studentId);
      // 后端返回的数据在 response.data 中
      if (response.data) {
        setReportData(response.data);
      } else {
        throw new Error("未能获取有效的报告数据。");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || '获取报告数据失败');
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]); // 当 fetchReportData (即 studentId) 变化时重新获取数据

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    // 传递 fetchReportData 作为重试函数
    return <Error message={error} onRetry={fetchReportData} />;
  }

  // 确保 reportData 不为 null
  if (!reportData) {
    return <Error message="未能加载报告数据。" onRetry={fetchReportData} />;
  }

  return (
    <div className={styles.reportContainer}>
      <h1>学生ID: {reportData.studentId} 的学习行为分析报告</h1>

      {/* 你可以添加更多的数据卡片 */}
      <div className={styles.reportCard}>
        <p className={styles.dataLabel}>总学习时长</p>
        <p className={styles.dataValue}>
          {reportData.learningHour} <span>小时</span>
        </p>
      </div>

      <button
        className={`${styles.btn} ${styles.btnSecondary}`}
        onClick={() => navigate('/dashboard')} // 点击返回仪表盘
      >
        返回仪表盘
      </button>
    </div>
  );
};

export default ReportPage;