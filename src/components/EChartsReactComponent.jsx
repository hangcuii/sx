// src/components/EChartsReactComponent.jsx

import React from 'react';
import ReactECharts from 'echarts-for-react';
import Loading from './Loading';

const EChartsReactComponent = ({ option, isLoading, style }) => {
  // 定义容器的默认样式，并与外部传入的 style 合并
  const containerStyle = {
    position: 'relative', // 父容器设为相对定位
    height: '400px',
    width: '100%',
    ...style, // 允许外部样式覆盖默认值
  };

  // 定义加载遮罩层的样式
  const loadingOverlayStyle = {
    position: 'absolute', // 遮罩层设为绝对定位
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // 半透明背景
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // 确保遮罩层在图表之上
    transition: 'opacity 0.3s ease-in-out', // 添加淡入淡出效果
    // 根据 isLoading 状态决定是否显示
    opacity: isLoading ? 1 : 0,
    pointerEvents: isLoading ? 'auto' : 'none', // 显示时可交互，隐藏时不可交互
  };

  return (
    <div style={containerStyle}>
      {/* 加载遮罩层，它始终存在，只是通过 opacity 控制显隐 */}
      <div style={loadingOverlayStyle}>
        <Loading />
      </div>

      {/* ReactECharts 组件也始终存在 */}
      <ReactECharts
        option={option || {}} // 即使option为空，也传递一个空对象避免错误
        style={{ height: '100%', width: '100%' }} // 让图表撑满父容器
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
};

export default EChartsReactComponent;