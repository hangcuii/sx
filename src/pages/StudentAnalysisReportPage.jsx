// src/pages/StudentAnalysisReportPage.jsx (修改后)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
import { useAuth } from '../context/AuthContext';
import { getStudentAnalysisReport } from '../services/api'; // 我们复用这个API，假设它现在返回课程列表
import styles from '../App.module.css';
import Loading from '../components/Loading';
import Error from '../components/Error'; // 引入Error组件以提供更好的错误反馈

const StudentAnalysisReportPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // 初始化 navigate

  // analysisData 重命名为 courses 以更符合其内容
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. 权限检查：检查用户是否登录，并且至少绑定了学生或教师ID
    if (!user || (!user.studentId && !user.teacherId)) {
      setIsLoading(false);
      setError("请先在个人中心绑定您的学生或教师身份，以查看相关课程报告。");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);


        const response = await getStudentAnalysisReport({ userId: user.userId });

        // 确保返回的是一个数组
        if (Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          console.error("API did not return an array:", response.data);
          setError("无法获取课程列表，返回的数据格式不正确。");
        }

      } catch (err) {
        console.error("获取课程列表失败:", err);
        const errorMessage = err.response?.data?.message || "无法加载课程列表，请稍后再试。";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]); // 依赖于user对象

  // 4. 用户选择与跳转：处理课程卡片的点击事件
  const handleCourseClick = (course) => {
    // 使用 navigate 进行跳转，并通过 state 传递整个 course 对象
    // 这比只传递 courseId 更灵活，因为目标页面可以直接使用 courseName 等信息
    navigate('/course-report-detail', { state: { course } });
  };

  // 重新加载数据的函数，传递给Error组件
  const handleRetry = () => {
    window.location.reload(); // 简单粗暴但有效的重试方式
  }

  if (isLoading) {
    return <Loading />;
  }

  // 如果有错误，显示错误组件
  if (error) {
    return <Error message={error} onRetry={handleRetry} />
  }

  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>请选择要查看报告的课程</h1>

      {courses.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {courses.map((course) => (
            <div
              // *** 修改点 1: key 使用 course.id ***
              key={course.id}
              className={styles.card}
              style={{ cursor: 'pointer', textAlign: 'center' }}
              onClick={() => handleCourseClick(course)}
            >
              <i className="fas fa-book" style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1rem' }}></i>

              <h3 style={{ fontSize: '1.2rem', margin: '0' }}>{course.name}</h3>

              <p style={{color: 'var(--color-text-light)', marginTop: '0.5rem'}}>ID: {course.id}</p>

              <p style={{color: 'var(--color-text-light)', fontSize: '0.8rem'}}>{course.tag}</p>
            </div>
          ))}
        </div>
      ) : (
        // 如果课程列表为空
        <p style={{ textAlign: 'center', fontSize: '1.1rem', color: 'var(--color-text-light)' }}>
          当前没有与您相关的课程。
        </p>
      )}
    </div>
  );
};

export default StudentAnalysisReportPage;