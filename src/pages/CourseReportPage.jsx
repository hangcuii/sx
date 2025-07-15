// src/pages/CourseReportPage.jsx (处理新数据并增加图表的版本)

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCourseReport } from '../services/api';
import styles from '../App.module.css';
import Loading from '../components/Loading';
import Error from '../components/Error';
import EChartsReactComponent from '../components/EChartsReactComponent'; // ** 1. 引入 ECharts 组件 **

const CourseReportPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 从路由状态获取课程信息 (假设上一页传递的是 {id, name})
  const course = location.state?.course;

  const [reportData, setReportData] = useState(null);
  const [gradeChartOption, setGradeChartOption] = useState({}); // ** 2. 新增图表配置状态 **
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

        // 使用 course.id (或您在上一页传递的实际ID字段)
        const requestData = {
          userId: user.userId,
          courseId: course.id
        };

        const response = await getCourseReport(requestData);
        const data = response.data;
        console.log("从后端获取到的完整报告数据:", data); // <<-- 添加这行来调试
        setReportData(data); // 保存原始数据

        // ** 3. 处理 grade 数据并生成图表 option **
        if (data && data.grade) {
          const gradeData = data.grade;
          // 定义X轴的标签
          const xAxisLabels = [
            '0-9分', '10-19分', '20-29分', '30-39分', '40-49分',
            '50-59分', '60-69分', '70-79分', '80-89分', '90-99分', '100分'
          ];
          // 从dict中按顺序提取Y轴的数据
          const seriesData = Object.keys(gradeData)
                                 .sort((a, b) => parseInt(a) - parseInt(b)) // 确保按 "0", "1", ... "10" 的顺序
                                 .map(key => gradeData[key]);

          setGradeChartOption({
            title: {
              text: '学生成绩分布',
              left: 'center'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              formatter: '{b}: {c}%' // 提示框格式
            },
            xAxis: {
              type: 'category',
              data: xAxisLabels,
              axisLabel: {
                interval: 0, // 强制显示所有标签
                rotate: 30   // 旋转标签以防重叠
              }
            },
            yAxis: {
              type: 'value',
              name: '学生占比',
              axisLabel: {
                formatter: '{value} %' // Y轴单位
              }
            },
            series: [{
              name: '学生占比',
              type: 'bar',
              data: seriesData,
              barWidth: '60%',
              itemStyle: {
                color: '#5470C6'
              }
            }],
            grid: {
              left: '3%',
              right: '4%',
              bottom: '10%', // 增加底部空间以容纳旋转的标签
              containLabel: true
            }
          });
        }

      } catch (err) {
        console.error(`获取课程 ${course.id} 的报告失败:`, err);
        setError("无法加载课程报告，请稍后再试。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [course, user]); // 移除 navigate，因为它在这里不是必须的依赖

  const handleRetry = () => window.location.reload();

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={`${styles.btn} ${styles.btnSecondary}`} style={{ marginBottom: '2rem' }}>
        <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
        返回课程列表
      </button>

      {/* 使用 course.name (或您传递的实际名称字段) */}
      <h1>{course ? `${course.name} - 学习行为报告` : '学习行为报告'}</h1>

      {isLoading && <Loading />}
      {error && <Error message={error} onRetry={handleRetry} />}

      {!isLoading && !error && reportData && (
        <>
          {/* ** 4. 修改文本指标的展示方式 ** */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div className={styles.card} style={{ textAlign: 'center' }}>
              <div className={styles.dataLabel}>课程平均完成率</div>
              <div className={styles.dataValue}>
                {reportData.class_complete_rate?.toFixed(2) || 'N/A'}
                <span>%</span>
              </div>
            </div>

            <div className={styles.card} style={{ textAlign: 'center' }}>
              <div className={styles.dataLabel}>视频平均完播率</div>
              <div className={styles.dataValue}>
                {reportData.video_complete_rate?.toFixed(2) || 'N/A'}
                <span>%</span>
              </div>
            </div>

          </div>

          {/* ** 5. 渲染图表 ** */}
          {gradeChartOption.series && (
            <div className={styles.card} style={{ padding: '2rem' }}>
               <EChartsReactComponent
                 option={gradeChartOption}
                 isLoading={isLoading}
                 style={{ height: '500px' }}
               />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseReportPage;