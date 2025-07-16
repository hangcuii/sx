// src/pages/DashboardPage.jsx (图标在上、文字居中的最终版)

import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../App.module.css';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  // 辅助函数，渲染引导部分
  const renderGuidanceSection = () => {
    if (!user) return null;
    const hasStudentId = !!user.studentId;
    const hasTeacherId = !!user.teacherId;
    const guidanceBoxStyle = {
      padding: '1.5rem',
      marginBottom: '3rem',
      borderRadius: 'var(--border-radius)',
      border: '1px solid var(--color-border)',
      textAlign: 'center',
      fontSize: '1.1rem',
      lineHeight: '1.6',
    };
    if (!hasStudentId && !hasTeacherId) {
      return (
        <div style={{...guidanceBoxStyle, backgroundColor: 'rgba(255, 193, 7, 0.1)', borderColor: 'rgba(255, 193, 7, 0.5)'}}>
          <i className="fas fa-info-circle" style={{ color: '#ffc107', marginRight: '10px' }}></i>
          <strong>新手引导：</strong>为了解锁核心分析功能，请先前往 <Link to="/personal-center" style={{ fontWeight: 'bold' }}>个人中心</Link> 绑定您的学生或教师身份。
          <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1rem', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
            <li>• 绑定 <strong>学生ID</strong> 以使用【学生中心】的功能。</li>
            <li>• 绑定 <strong>教师ID</strong> 以使用【教师中心】的功能。</li>
            <li>• 绑定 <strong>任一ID</strong> 即可使用【学习中心】的学情分析功能。</li>
          </ul>
        </div>
      );
    }
    if (hasStudentId && hasTeacherId) {
       return (
        <div style={{...guidanceBoxStyle, backgroundColor: 'rgba(40, 167, 69, 0.1)', borderColor: 'rgba(40, 167, 69, 0.5)'}}>
           <i className="fas fa-check-circle" style={{ color: '#28a745', marginRight: '10px' }}></i>
           您已绑定学生和教师双重身份，所有功能均已为您解锁！
        </div>
       );
    }
    if (hasStudentId || hasTeacherId) {
      return (
        <div style={{...guidanceBoxStyle, backgroundColor: 'rgba(0, 123, 255, 0.05)', borderColor: 'rgba(0, 123, 255, 0.3)'}}>
          <i className="fas fa-lightbulb" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>
          {hasStudentId && <strong>【学生中心】功能已解锁。</strong>}
          {hasTeacherId && <strong>【教师中心】功能已解锁。</strong>}
          {' '}您可以继续探索，或前往 <Link to="/personal-center" style={{ fontWeight: 'bold' }}>个人中心</Link>
          {hasStudentId ? ' 绑定教师身份' : ' 绑定学生身份'}以解锁更多功能。
        </div>
      );
    }
    return null;
  };

  // 竖排卡片容器的样式
  const cardContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
  };

  // *** 为单个卡片定义样式 ***
  const singleCardStyle = {
    width: '100%',
    maxWidth: '800px',
    // 继承 .card 的基础样式，但覆盖以下属性
    display: 'flex',
    flexDirection: 'column', // 纵向排列
    alignItems: 'center',    // 水平居中
    justifyContent: 'center',// 垂直居中
    textAlign: 'center',     // 让所有内部文本居中
    gap: '1rem',             // 元素之间的垂直间距
  };

  return (
    <div>
      {/* 欢迎语 */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
          欢迎使用大数据分析系统
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-light)' }}>
          请选择您要进入的功能中心，开启数据洞察之旅。
        </p>
      </div>

      {/* 动态引导区域 */}
      {renderGuidanceSection()}

      {/* 竖排功能中心卡片布局 */}
      <div style={cardContainerStyle}>


        {/* ==================== 学生中心 ==================== */}
        <Link to="/student-center" className={styles.card} style={singleCardStyle}>
          <i className="fas fa-user-graduate" style={{ fontSize: '3rem', color: 'var(--color-primary)' }}></i>
          <h2>学生中心</h2>
          <p>包含【学习行为分析】与【个人学习画像】。深入探索个人学习数据，发现您的学习潜能。</p>
        </Link>

        {/* ==================== 教师中心 ==================== */}
        <Link to="/teacher-center" className={styles.card} style={singleCardStyle}>
          <i className="fas fa-person-chalkboard" style={{ fontSize: '3rem', color: 'var(--color-primary)' }}></i>
          <h2>教师中心</h2>
          <p>包含【个人教学画像】。获取专属教学分析，助力教学策略优化。</p>
        </Link>

        {/* ==================== 学习中心 ==================== */}
        <Link to="/learning-center" className={styles.card} style={singleCardStyle}>
          <i className="fas fa-book-open-reader" style={{ fontSize: '3rem', color: 'var(--color-primary)' }}></i>
          <h2>学习中心</h2>
          <p>包含【课程学情报告】与【教学资源分析】。洞察课程表现与平台资源热度趋势。</p>
        </Link>

        {/* ==================== 个人中心 ==================== */}
        <Link to="/personal-center" className={styles.card} style={singleCardStyle}>
          <i className="fas fa-user-cog" style={{ fontSize: '3rem', color: 'var(--color-primary)' }}></i>
          <h2>个人中心</h2>
          <p>包含【账户信息修改】与【身份绑定】。管理您的账户信息与安全设置。</p>
        </Link>

      </div>
    </div>
  );
};

export default DashboardPage;