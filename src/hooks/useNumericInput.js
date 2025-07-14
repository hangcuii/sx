import { useState } from 'react';

// 这个 Hook 封装了处理数字输入的所有逻辑
export function useNumericInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    const allowedKeys = [
      "Backspace", "Delete", "Tab", "Escape", "Enter",
      "ArrowLeft", "ArrowRight", "Home", "End"
    ];

    if (allowedKeys.includes(e.key)) {
      return;
    }

    if ((e.key === 'a' || e.key === 'A') && (e.ctrlKey || e.metaKey)) {
      return;
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // 返回状态值和事件处理器，让组件可以绑定到 input 上
  return {
    value,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
  };
}