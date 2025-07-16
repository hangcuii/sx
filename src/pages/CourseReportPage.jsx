// src/pages/CourseReportPage.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCourseReport } from '../services/api';
import styles from '../App.module.css';
import Loading from '../components/Loading';
import Error from '../components/Error';
import EChartsReactComponent from '../components/EChartsReactComponent';
import MetricCard from '../components/MetricCard'; // 1. 导入 MetricCard 组件

const CourseReportPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const course = location.state?.course;

  const [reportData, setReportData] = useState(null);
  const [gradeChartOption, setGradeChartOption] = useState(null); // 初始值设为 null
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!course) {
      setError("未指定课程信息，请先从课程列表选择。");
      setIsLoading(false);
      return;
    }
    if (!user) {
      setError("用户未登录。");
      setIsLoading(false);
      return;
    }

    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setGradeChartOption(null); // 重置图表

        const requestData = {
          userId: user.userId,
          courseId: course.id
        };

        const response = await getCourseReport(requestData);
        const data = response.data;
        setReportData(data);

        // 处理 grade 数据并生成图表 option
        if (data && typeof data.grade === 'object' && data.grade !== null) {
          const gradeData = data.grade;
          const xAxisLabels = [
            '0-9分', '10-19分', '20-29分', '30-39分', '40-49分',
            '50-59分', '60-69分', '70-79分', '80-89分', '90-99分', '100分'
          ];
          const seriesData = Object.keys(gradeData)
                                 .sort((a, b) => parseInt(a) - parseInt(b))
                                 .map(key => gradeData[key]);

          const newChartOption = {
            title: { text: '学生成绩分布', left: 'center' },
            tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
            xAxis: { type: 'category', data: xAxisLabels, axisLabel: { interval: 0, rotate: 30 } },
            yAxis: { type: 'value', name: '学生占比', axisLabel: { formatter: '{value} %' } },
            series: [{ name: '学生占比', type: 'bar', data: seriesData, barWidth: '60%', itemStyle: { color: '#5470C6' } }],
            grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true }
          };

          // 使用 setTimeout 确保DOM渲染完成
          setTimeout(() => {
            setGradeChartOption(newChartOption);
          }, 0);
        }

      } catch (err) {
        console.error(`获取课程 ${course.id} 的报告失败:`, err);
        setError("无法加载课程报告，请稍后再试。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [course, user]);

  const handleRetry = () => window.location.reload();

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={`${styles.btn} ${styles.btnSecondary}`} style={{ marginBottom: '2rem' }}>
        <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
        返回课程列表
      </button>

      <h1>{course ? `${course.name} - 学情分析报告` : '学情分析报告'}</h1>

      {isLoading && <Loading />}
      {error && <Error message={error} onRetry={handleRetry} />}

      {!isLoading && !error && reportData && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

            <MetricCard
              icon="fas fa-check-circle"
              label="课程平均完成率"
              value={reportData.class_complete_rate}
              unit="%"
              precision={2}
              themeColor="#28a745" // 绿色主题
            />

            <MetricCard
              icon="fas fa-play-circle"
              label="视频平均完播率"
              value={reportData.video_complete_rate}
              unit="%"
              precision={2}
              themeColor="#ffc107" // 黄色主题
            />

          </div>

          {/* 渲染图表部分 */}
          {gradeChartOption ? (
            <div className={styles.card} style={{ padding: '2rem' }}>
               <EChartsReactComponent
                 option={gradeChartOption}
                 style={{ height: '500px', width: '100%' }}
               />
            </div>
          ) : (
            <div className={styles.card} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
              <p>学生成绩分布数据暂不可用。</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseReportPage;