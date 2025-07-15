//src/components/Error.jsx

import React from 'react';
import styles from '../App.module.css';

function Error({ message, onRetry }) {
  return (
    <div style={{ textAlign: 'center', color: 'red', padding: '50px 0' }}>
      <h2>加载失败</h2>
      <p>{message}</p>
      {/* 传递一个onRetry函数，让用户可以重试 */}
      <button className={styles['back-to-portal-btn']} onClick={onRetry}>
        返回重试
      </button>
    </div>
  );
}

export default Error;