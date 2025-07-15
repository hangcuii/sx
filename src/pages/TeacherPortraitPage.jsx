// src/pages/TeacherPortraitPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTeacherPortraitData } from '../services/api';
import Loading from '../components/Loading';
import styles from '../App.module.css';

const TeacherPortraitPage = () => {
  const { user } = useAuth();

  const [portraitData, setPortraitData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 检查用户是否已登录并绑定了教师身份
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

  // 展示“教学方向”
  const tagStyle = {
    display: 'inline-block',
    padding: '0.4rem 0.8rem',
    margin: '0.2rem',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    fontWeight: '500',
    fontSize: '0.9rem',
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>教师画像</h1>

      {error && <p className={styles.errorMessage} style={{ textAlign: 'center' }}>{error}</p>}

      {!isLoading && !error && portraitData && (
        <>
          {/* 综合评价卡片 */}
          <div className={styles.card} style={{ marginBottom: '2rem' }}>
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

          {/* 网格布局展示其他关键数据 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

            {/* 教学方向卡片 */}
            <div className={`${styles.card}`} style={{ textAlign: 'center' }}>
              <i className="fas fa-compass" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}></i>
              <h3 className={styles.dataLabel} style={{ marginBottom: '1rem' }}>教学方向</h3>
              <div>
                {portraitData['tagset'].map(direction => (
                  <span key={direction} style={tagStyle}>
                    {direction}
                  </span>
                ))}
              </div>
            </div>

            {/* 教学视频总时长卡片 */}
            <div className={`${styles.card}`} style={{ textAlign: 'center' }}>
              <i className="fas fa-video" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}></i>
              <h3 className={styles.dataLabel}>教学视频总时长</h3>
              <div className={styles.dataValue}>
                {portraitData['total_time']}
                <span>小时</span>
              </div>
            </div>

            {/* 学生平均成绩卡片 */}
            <div className={`${styles.card}`} style={{ textAlign: 'center' }}>
              <i className="fas fa-star" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}></i>
              <h3 className={styles.dataLabel}>学生平均成绩</h3>
              <div className={styles.dataValue}>
                {portraitData['grade']}
                <span>分</span>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default TeacherPortraitPage;