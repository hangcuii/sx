// src/pages/StudentPortraitPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentPortraitData } from '../services/api';
import EChartsReactComponent from '../components/EChartsReactComponent';
import Loading from '../components/Loading';
import styles from '../App.module.css';

const StudentPortraitPage = () => {
  const { user } = useAuth();

  const [intentionOption, setIntentionOption] = useState({});
  const [gradesOption, setGradesOption] = useState({});
  const [evaluationText, setEvaluationText] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

        const response = await getStudentPortraitData({ userId: user.userId });
        const data = response.data;



        // 处理学习意向数据
        const intentionData = data['intention'];
        const intentionIndicators = Object.keys(intentionData).map(name => ({ name, max: 5 }));
        const intentionValues = Object.values(intentionData);

        setIntentionOption({
          title: { text: '学习意向多维图', left: 'center' },
          tooltip: { trigger: 'item' },
          radar: {
            indicator: intentionIndicators,
          },
          series: [{
            name: '学习意向',
            type: 'radar',
            data: [{
              value: intentionValues,
              name: '意向得分'
            }]
          }]
        });

        // 处理学习成绩数据
        const gradesData = data['score'];
        const gradesIndicators = Object.keys(gradesData).map(name => ({ name, max: 5 }));
        const gradesValues = Object.values(gradesData);

        setGradesOption({
          title: { text: '学习成绩多维图', left: 'center' },
          tooltip: { trigger: 'item' },
          radar: {
            indicator: gradesIndicators,
          },
          series: [{
            name: '学习成绩',
            type: 'radar',
            data: [{
              value: gradesValues,
              name: '成绩评定'
            }],
            itemStyle: { color: '#5470C6' },
            areaStyle: { color: 'rgba(84, 112, 198, 0.4)' }
          }]
        });

        // 设置评价语
        setEvaluationText(data['evaluation']);

      } catch (err) {
        console.error("获取学生画像数据失败:", err);
        setError("无法加载学生画像，请稍后再试。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>学生画像分析</h1>

      {error && <p className={styles.errorMessage} style={{ textAlign: 'center' }}>{error}</p>}

      {!isLoading && !error && evaluationText && (
        <>
          {/* 学生评价展示区 */}
          <div className={styles.card} style={{ marginBottom: '2rem' }}>
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

          {/* 两个雷达图并排展示 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <div className={styles.card}>
              <EChartsReactComponent option={intentionOption} isLoading={isLoading} />
            </div>
            <div className={styles.card}>
              <EChartsReactComponent option={gradesOption} isLoading={isLoading} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentPortraitPage;