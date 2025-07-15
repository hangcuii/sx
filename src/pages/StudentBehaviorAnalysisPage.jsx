// src/pages/StudentBehaviorAnalysisPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentBehaviorAnalysis } from '../services/api';
import styles from '../App.module.css';
import Loading from '../components/Loading';
import Error from '../components/Error'; // 推荐引入Error组件
import MetricCard from '../components/MetricCard'; // 1. 导入新的 MetricCard 组件

const StudentBehaviorAnalysisPage = () => {
  const { user } = useAuth();

  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 用于传递给Error组件的重试函数
  const handleRetry = () => {

      window.location.reload();
  };

  useEffect(() => {
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
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
      return <Error message={error} onRetry={handleRetry} />
  }

  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>学生学习行为分析</h1>

      {analysisData && (
        // 使用网格布局来展示一系列指标卡片
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

          <MetricCard
            icon="fas fa-clock"
            label="总学时"
            value={analysisData['total_time']}
            unit="小时"
            precision={1} // 保留一位小数
          />

          <MetricCard
            icon="fas fa-check-circle"
            label="课程平均完成率"
            value={analysisData['class_complete_rate']}
            unit="%"
            precision={2} // 保留两位小数
          />

          <MetricCard
            icon="fas fa-play-circle"
            label="视频平均完播率"
            value={analysisData['video_complete_rate']}
            unit="%"
            precision={2}
          />


        </div>
      )}
    </div>
  );
};

export default StudentBehaviorAnalysisPage;