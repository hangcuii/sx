import React from 'react';

function Loading() {
  return (
    <div style={{ textAlign: 'center', padding: '50px 0' }}>
      <p style={{ fontSize: '1.5rem' }}>正在加载分析报告...</p>
      {/* 在这里放一个真正的加载动画/SVG */}
    </div>
  );
}

export default Loading;