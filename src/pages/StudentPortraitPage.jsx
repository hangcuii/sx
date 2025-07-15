// src/pages/StudentPortraitPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentPortraitData } from '../services/api';
import EChartsReactComponent from '../components/EChartsReactComponent';
import Loading from '../components/Loading';
import Error from '../components/Error'; // 推荐引入
import styles from '../App.module.css';

const StudentPortraitPage = () => {
  const { user } = useAuth();

  const [intentionOption, setIntentionOption] = useState(null); // 初始值设为 null
  const [gradesOption, setGradesOption] = useState(null);   // 初始值设为 null
  const [evaluationText, setEvaluationText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleRetry = () => window.location.reload();

  useEffect(() => {
    if (!user || !user.studentId) {
      setIsLoading(false);
      setError("请先绑定您的学生身份以查看学生画像。");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIntentionOption(null);
        setGradesOption(null);

        const response = await getStudentPortraitData({ userId: user.userId });
        const data = response.data;
        setEvaluationText(data['evaluation']);


        if (data && data.intention) {
            const intentionData = data['intention'];
            const intentionIndicators = Object.keys(intentionData).map(name => ({ name, max: 5 }));
            const intentionValues = Object.values(intentionData);

            const newIntentionOption = {
                title: { text: '学习意向多维图', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
                tooltip: { trigger: 'item' },
                legend: { data: ['意向得分'], bottom: 10 },
                radar: {
                    indicator: intentionIndicators,
                    shape: 'circle',
                    splitNumber: 5,
                    axisName: { color: '#666', fontSize: 14 },
                    splitArea: { areaStyle: { color: ['rgba(255, 193, 7, 0.1)', 'rgba(255, 193, 7, 0.05)'] } },
                    axisLine: { lineStyle: { color: 'rgba(255, 193, 7, 0.2)' } },
                    splitLine: { lineStyle: { color: 'rgba(255, 193, 7, 0.2)' } }
                },
                series: [{
                    name: '学习意向',
                    type: 'radar',
                    data: [{
                        value: intentionValues,
                        name: '意向得分',
                        symbol: 'circle',
                        symbolSize: 8,
                        lineStyle: { width: 3, color: '#ffc107' },
                        areaStyle: { color: 'rgba(255, 193, 7, 0.5)' }
                    }]
                }]
            };
            setTimeout(() => setIntentionOption(newIntentionOption), 0);
        }

        if (data && data.score) {
            const gradesData = data['score'];
            const gradesIndicators = Object.keys(gradesData).map(name => ({ name, max: 5 }));
            const gradesValues = Object.values(gradesData);

            const newGradesOption = {
                title: { text: '学习成绩多维图', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
                tooltip: { trigger: 'item' },
                legend: { data: ['成绩评定'], bottom: 10 },
                radar: {
                    indicator: gradesIndicators,
                    shape: 'polygon',
                    splitNumber: 5,
                    axisName: { color: '#666', fontSize: 14 },
                    splitArea: { areaStyle: { color: ['rgba(84, 112, 198, 0.1)', 'rgba(84, 112, 198, 0.05)'] } },
                    axisLine: { lineStyle: { color: 'rgba(84, 112, 198, 0.2)' } },
                    splitLine: { lineStyle: { color: 'rgba(84, 112, 198, 0.2)' } }
                },
                series: [{
                    name: '学习成绩',
                    type: 'radar',
                    data: [{
                        value: gradesValues,
                        name: '成绩评定',
                        symbol: 'roundRect',
                        symbolSize: 8,
                        lineStyle: { width: 3, color: '#5470C6' },
                        areaStyle: { color: 'rgba(84, 112, 198, 0.5)' }
                    }]
                }]
            };
            setTimeout(() => setGradesOption(newGradesOption), 0);
        }

      } catch (err) {
        console.error("获取学生画像数据失败:", err);
        setError("无法加载学生画像，请稍后再试。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>学生画像分析</h1>

      {isLoading && <Loading />}
      {error && <Error message={error} onRetry={handleRetry} />}

      {!isLoading && !error && (
        <>
          {/* 学生评价展示区 */}
          {evaluationText && (
            <div className={styles.card} style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)'}}>综合评价</h2>
              <blockquote style={{
                margin: '1rem 0 0',
                padding: '1rem',
                background: 'var(--color-background)',
                borderLeft: '5px solid var(--color-primary)',
                fontSize: '1rem',
                color: 'var(--color-text-light)',
                lineHeight: '1.6'
              }}>
                {evaluationText}
              </blockquote>
            </div>
          )}

          {/* 两个雷达图并排展示 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

            {intentionOption ? (
              <div className={styles.card}>
                <EChartsReactComponent option={intentionOption} style={{ height: '500px' }} />
              </div>
            ) : <div className={styles.card}><p>学习意向数据加载失败或为空。</p></div>}

            {gradesOption ? (
              <div className={styles.card}>
                <EChartsReactComponent option={gradesOption} style={{ height: '500px' }} />
              </div>
            ) : <div className={styles.card}><p>学习成绩数据加载失败或为空。</p></div>}

          </div>
        </>
      )}
    </div>
  );
};

export default StudentPortraitPage;