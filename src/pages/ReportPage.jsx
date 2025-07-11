// src/pages/ReportPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 使用 useParams 获取 URL 参数
import Loading from '../components/Loading';
import Error from '../components/Error';
import { getStudentLearningBehavior } from '../services/api'; // 封装好的 API 调用

const ReportPage = () => {
  const { studentId } = useParams(); // 从 URL 中获取 studentId
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 初始为 true
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getStudentLearningBehavior(studentId); // 使用封装的 API
        setReportData(data);
      } catch (err) {
        setError(err.response?.data?.message || '获取报告数据失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [studentId]); // 当 studentId 变化时重新获取数据

  const handleRetry = () => {
    // 重新获取数据
    window.location.reload(); // 简单粗暴的方式
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} onRetry={handleRetry} />;

  return (
    <div>
      <h2>学生 {studentId} 的学习行为报告</h2>
      {/* 在这里使用 reportData 渲染你的报告图表和内容 */}
      <pre>{JSON.stringify(reportData, null, 2)}</pre>
    </div>
  );
};

export default ReportPage;