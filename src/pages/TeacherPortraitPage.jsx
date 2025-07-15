// src/pages/TeacherPortraitPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTeacherPortraitData } from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error'; // 推荐引入
import MetricCard from '../components/MetricCard'; // 1. 导入 MetricCard 组件
import styles from '../App.module.css';

const TeacherPortraitPage = () => {
  const { user } = useAuth();

  const [portraitData, setPortraitData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 用于传递给Error组件的重试函数
  const handleRetry = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (!user || !user.teacherId) {
      setIsLoading(false);
      setError("请先绑定您的教师身份以查看教师画像。");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getTeacherPortraitData({ userId: user.userId });
        setPortraitData(response.data);
      } catch (err) {
        console.error("获取教师画像数据失败:", err);
        setError("无法加载教师画像，请稍后再试。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // “教学方向”标签的样式，可以保留
  const tagStyle = {
    display: 'inline-block',
    padding: '0.4rem 0.8rem',
    margin: '0.3rem',
    borderRadius: '15px', // 改为胶囊形状
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    fontWeight: '500',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />
  }

  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>教师画像</h1>

      {portraitData && (
        <>
          {/* 综合评价卡片 (保持原样，因为是文本块) */}
          <div className={styles.card} style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>综合评价</h2>
            <blockquote style={{
              margin: '1rem 0 0',
              padding: '1rem',
              background: 'var(--color-background)',
              borderLeft: '5px solid var(--color-primary)',
              fontSize: '1rem',
              color: 'var(--color-text-light)',
              lineHeight: '1.6'
            }}>
              {portraitData['evaluation']}
            </blockquote>
          </div>

          {/* 使用网格布局来展示其他关键数据 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

            {/* 教学方向卡片  */}
            <div className={`${styles.card}`} style={{ textAlign: 'center', padding: '2rem' }}>
              <i className="fas fa-compass" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}></i>
              <h3 className={styles.dataLabel} style={{ marginBottom: '1rem', textTransform: 'uppercase' }}>教学方向</h3>
              <div>
                {portraitData['tagset'] && portraitData['tagset'].map(direction => (
                  <span key={direction} style={tagStyle}>
                    {direction}
                  </span>
                ))}
              </div>
            </div>

            <MetricCard
              icon="fas fa-video"
              label="教学视频总时长"
              value={portraitData['total_time']}
              unit="小时"
              precision={1}
              themeColor="#007bff" // 蓝色主题
            />

            <MetricCard
              icon="fas fa-star"
              label="学生平均成绩"
              value={portraitData['grade']}
              unit="分"
              precision={1}
              themeColor="#28a745" // 绿色主题
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherPortraitPage;