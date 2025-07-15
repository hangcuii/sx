// src/pages/BindStudentPage.jsx
import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import styles from '../App.module.css';
import { useAuth } from '../context/AuthContext';
import { bindStudent as bindStudentApi } from '../services/api';
import { useNumericInput } from '../hooks/useNumericInput';

const BindStudentPage = () => {
  const studentIdInput = useNumericInput('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRebinding, setIsRebinding] = useState(false);

  const { user, updateUserStudentId, clearUserStudentId } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedId = studentIdInput.value.trim();
    if (!trimmedId) {
      setError('学生ID不能为空');
      return;
    }
    const studentIdAsNumber = parseInt(trimmedId, 10);
    if (isNaN(studentIdAsNumber)) {
      setError('请输入有效的学生ID（仅包含数字）。');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await bindStudentApi({ userId: user.userId, studentId: studentIdAsNumber });
      updateUserStudentId(studentIdAsNumber);
      alert('学生信息绑定成功！');
      setIsRebinding(false); // 成功后关闭表单界面
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || '操作失败，请重试。';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理解除绑定的逻辑
  const handleUnbind = async () => {
    if (!window.confirm('您确定要解除与该学生信息的绑定吗？')) {
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await bindStudentApi({ userId: user.userId, studentId: null });
      clearUserStudentId();
      alert('解除绑定成功！');
    } catch (err)
    {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || '操作失败，请重试。';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBindingForm = () => (
    <div className={styles.formContainer}>
      <h2>{isRebinding ? '更换绑定学生信息' : '绑定学生信息'}</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <i className={`fas fa-id-card ${styles.inputIcon}`}></i>
          <input
            type="number"
            id="studentId"
            className={styles.inputField}
            placeholder="请输入学生ID"
            required
            {...studentIdInput}
          />
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary} ${styles.submitButton}`}
          disabled={isLoading}
        >
          {isLoading ? '处理中...' : '确认绑定'}
        </button>
      </form>
      {isRebinding ? (
        <button onClick={() => setIsRebinding(false)} className={`${styles.btn} ${styles.btnSecondary}`} style={{ marginTop: '1rem' }}>
          取消
        </button>
      ) : (
        <Link to="/dashboard" className={`${styles.btn} ${styles.btnSecondary}`} style={{ marginTop: '1rem' }}>
          稍后绑定
        </Link>
      )}
    </div>
  );

  // 如果用户未绑定，或者正在进行更换绑定，则显示表单
  if (!user || user.studentId == null || isRebinding) {
    return renderBindingForm();
  }

  // 如果用户已绑定，则显示信息和操作按钮
  return (
    <div className={styles.formContainer}>
      <h2>学生信息</h2>
      <p>您当前绑定的学生ID为: <strong>{user.studentId}</strong></p>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.buttonGroup} style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button onClick={() => setIsRebinding(true)} className={`${styles.btn} ${styles.btnPrimary}`} disabled={isLoading}>
          更换绑定
        </button>
        <button onClick={handleUnbind} className={`${styles.btn} ${styles.btnDanger}`} disabled={isLoading}>
          {isLoading ? '处理中...' : '解除绑定'}
        </button>
      </div>
      <Link to="/dashboard" className={`${styles.btn} ${styles.btnSecondary}`} style={{ marginTop: '1rem' }}>
          返回首页
      </Link>
    </div>
  );
};

export default BindStudentPage;