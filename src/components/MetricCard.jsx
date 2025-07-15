// src/components/MetricCard.jsx

import React from 'react';
import CountUp from 'react-countup'; // 1. 导入数字滚动动画库
import styles from '../App.module.css';

const MetricCard = ({ icon, label, value, unit, precision = 0, themeColor = 'var(--color-primary)' }) => {

  // 定义卡片的动态样式，基于传入的主题色
  const cardStyle = {
    padding: '1.5rem',
    borderRadius: 'var(--border-radius)',
    backgroundColor: '#fff',
    boxShadow: 'var(--box-shadow)',
    textAlign: 'center',
    position: 'relative', // 用于定位伪元素
    overflow: 'hidden',   // 隐藏超出部分的伪元素
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // 为 hover 效果添加过渡
    borderTop: `4px solid ${themeColor}`, //顶部增加一条彩色边框
  };

  // Hover 效果的样式，React内联样式不支持 :hover，所以在 CSS 文件中实现

  const iconStyle = {
    fontSize: '2.5rem',
    color: themeColor, // 图标使用主题色
    marginBottom: '1rem',
  };

  const labelStyle = {
    fontSize: '0.9rem',
    color: 'var(--color-text-light)',
    marginBottom: '0.25rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  const valueStyle = {
    fontSize: '3rem',
    fontWeight: '700', // 字体更粗
    color: '#333',
    lineHeight: 1.1,
  };

  const unitStyle = {
    fontSize: '1rem',
    fontWeight: '500',
    color: 'var(--color-text-light)',
    marginLeft: '0.5rem',
  };

  return (
    <div className={styles.metricCardWrapper}>
      <div style={cardStyle}>
        <i className={icon} style={iconStyle}></i>
        <div style={labelStyle}>{label}</div>
        <div style={valueStyle}>
          {/* 使用 CountUp 组件来实现数字滚动动画 */}
          <CountUp
            start={0}
            end={typeof value === 'number' ? value : 0}
            duration={0.8} // 动画持续时间
            separator=","   // 千位分隔符
            decimals={precision}
            decimal="."
          />
          {unit && <span style={unitStyle}>{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;