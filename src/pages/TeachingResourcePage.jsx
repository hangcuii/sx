// src/pages/TeachingResourcePage.jsx

import React, { useState, useEffect } from 'react';
import { getTeachingResourceData } from '../services/api';
import EChartsReactComponent from '../components/EChartsReactComponent';
import Loading from '../components/Loading';
import Error from '../components/Error'; // 推荐引入
import styles from '../App.module.css';

const TeachingResourcePage = () => {
  const [resourceChartOption, setResourceChartOption] = useState(null); // 初始值设为 null
  const [learnerChartOption, setLearnerChartOption] = useState(null);  // 初始值设为 null
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleRetry = () => window.location.reload();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setResourceChartOption(null);
        setLearnerChartOption(null);

        const response = await getTeachingResourceData();
        const data = response.data;


        if (data && data.direction) {
          const resourceData = data['direction'];
          const resourceValues = Object.values(resourceData);
          const resourceIndicators = Object.keys(resourceData).map(name => ({
            name,
            max: 5, // 假设最大值是5
          }));

          const newResourceOption = {
            title: { text: '教学方向热度分析', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
            tooltip: { trigger: 'item',},
            legend: { // 增加图例
              data: ['热度评分'],
              bottom: 10,
            },
            radar: {
              indicator: resourceIndicators,
              shape: 'circle', // 可以是 'circle' 或 'polygon'
              splitNumber: 5,
              axisName: {
                formatter: '{value}',
                color: '#4285F4',
                fontSize: 14,
              },
              splitArea: { // 分隔区域的样式
                areaStyle: {
                  color: ['rgba(66, 133, 244, 0.1)', 'rgba(66, 133, 244, 0.05)'],
                  shadowColor: 'rgba(0, 0, 0, 0.2)',
                  shadowBlur: 10
                }
              },
              axisLine: { lineStyle: { color: 'rgba(66, 133, 244, 0.2)' } },
              splitLine: { lineStyle: { color: 'rgba(66, 133, 244, 0.2)' } }
            },
            series: [{
              name: '方向热度',
              type: 'radar',
              data: [{
                value: resourceValues,
                name: '热度评分',
                symbol: 'rect', // 数据点的形状
                symbolSize: 8,
                lineStyle: { width: 3, color: '#f3a633' },
                areaStyle: { color: 'rgba(243, 166, 51, 0.6)' }
              }]
            }]
          };
          setTimeout(() => setResourceChartOption(newResourceOption), 0);
        }


        if (data && data.number) {
          const learnerData = data['number'];
          const learnerValues = Object.values(learnerData);
          const learnerIndicators = Object.keys(learnerData).map(name => ({
            name,
            max: 5, // 假设最大值是5
          }));

          const newLearnerOption = {
            title: { text: '各方向学习人数分布', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
            tooltip: { trigger: 'item'},
            legend: {
              data: ['人数评级'],
              bottom: 10,
            },
            radar: {
              indicator: learnerIndicators,
              shape: 'polygon',
              splitNumber: 5,
              axisName: {
                color: '#34A853',
                fontSize: 14,
              },
              splitArea: {
                areaStyle: {
                  color: ['rgba(52, 168, 83, 0.1)', 'rgba(52, 168, 83, 0.05)'],
                  shadowOffsetX: 0,
                  shadowOffsetY: 10,
                  shadowBlur: 20,
                  opacity: 0.2
                }
              },
              axisLine: { lineStyle: { color: 'rgba(52, 168, 83, 0.2)' } },
              splitLine: { lineStyle: { color: 'rgba(52, 168, 83, 0.2)' } }
            },
            series: [{
              name: '学习人数',
              type: 'radar',
              data: [{
                value: learnerValues,
                name: '人数评级',
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: { width: 3, color: '#34A853' },
                areaStyle: { color: 'rgba(52, 168, 83, 0.6)' }
              }]
            }]
          };
          setTimeout(() => setLearnerChartOption(newLearnerOption), 0);
        }

      } catch (err) {
        console.error("获取教学资源数据失败:", err);
        setError("无法加载教学资源分析，请稍后再试。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>教学资源分析</h1>

      {isLoading && <Loading />}
      {error && <Error message={error} onRetry={handleRetry} />}

      {!isLoading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

          {resourceChartOption ? (
            <div className={styles.card}>
              <EChartsReactComponent option={resourceChartOption} style={{ height: '500px' }} />
            </div>
          ) : <div className={styles.card}><p>热度数据加载失败或为空。</p></div>}

          {learnerChartOption ? (
            <div className={styles.card}>
              <EChartsReactComponent option={learnerChartOption} style={{ height: '500px' }} />
            </div>
          ) : <div className={styles.card}><p>学习人数数据加载失败或为空。</p></div>}

        </div>
      )}
    </div>
  );
};

export default TeachingResourcePage;