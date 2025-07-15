// src/pages/TeachingResourcePage.jsx

import React, { useState, useEffect } from 'react';
import { getTeachingResourceData } from '../services/api'; // 引入新的API函数
import EChartsReactComponent from '../components/EChartsReactComponent';
import Loading from '../components/Loading';
import styles from '../App.module.css';

const TeachingResourcePage = () => {
  // 为两个图表分别设置 state
  const [resourceChartOption, setResourceChartOption] = useState({});
  const [learnerChartOption, setLearnerChartOption] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    //没有依赖项，所以它只在组件首次加载时运行一次。
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getTeachingResourceData();
        const data = response.data;


        // 处理教学方向多维图
        const resourceData = data['direction'];
        const resourceIndicators = Object.keys(resourceData).map(name => ({ name, max: 5 }));
        const resourceValues = Object.values(resourceData);

        setResourceChartOption({
          title: { text: '教学方向热度分析', left: 'center' },
          tooltip: { trigger: 'item' },
          radar: {
            indicator: resourceIndicators,
          },
          series: [{
            name: '方向热度',
            type: 'radar',
            data: [{
              value: resourceValues,
              name: '热度评分'
            }]
          }]
        });

        // 处理教学方向学习人数多维图
        const learnerData = data['number'];
        const learnerIndicators = Object.keys(learnerData).map(name => ({ name, max: 5 }));
        const learnerValues = Object.values(learnerData);

        setLearnerChartOption({
          title: { text: '各方向学习人数分布', left: 'center' },
          tooltip: { trigger: 'item' },
          radar: {
            indicator: learnerIndicators,
          },
          series: [{
            name: '学习人数',
            type: 'radar',
            data: [{
              value: learnerValues,
              name: '人数评级'
            }],
            itemStyle: { color: '#5470C6' },
            areaStyle: { color: 'rgba(84, 112, 198, 0.4)' }
          }]
        });

      } catch (err) {
        console.error("获取教学资源数据失败:", err);
        setError("无法加载教学资源分析，请稍后再试。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // 空依赖数组，确保只在挂载时执行一次

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>教学资源分析</h1>

      {error && <p className={styles.errorMessage} style={{ textAlign: 'center' }}>{error}</p>}

      {!isLoading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          <div className={styles.card}>
            <EChartsReactComponent option={resourceChartOption} isLoading={isLoading} />
          </div>
          <div className={styles.card}>
            <EChartsReactComponent option={learnerChartOption} isLoading={isLoading} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachingResourcePage;