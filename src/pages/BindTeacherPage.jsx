// src/pages/BindStudentPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../App.module.css';
import { useAuth } from '../context/AuthContext';
import { bindTeacher as bindTeacherApi } from '../services/api'; // 使用 bindTeacher
import { useNumericInput } from '../hooks/useNumericInput';

const BindTeacherPage = () => {
  const teacherIdInput = useNumericInput('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRebinding, setIsRebinding] = useState(false);

  const { user, updateUserTeacherId, clearUserTeacherId } = useAuth(); // 使用 teacher 相关函数
  //const navigate = useNavigate();

  // 处理绑定和更换绑定的提交逻辑
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedId = teacherIdInput.value.trim();
    if (!trimmedId) {
      setError('教师ID不能为空');
      return;
    }
    const teacherIdAsNumber = parseInt(trimmedId, 10);
    if (isNaN(teacherIdAsNumber)) {
      setError('请输入有效的教师ID（仅包含数字）。');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await bindTeacherApi({ userId: user.userId, teacherId: teacherIdAsNumber });
      updateUserTeacherId(teacherIdAsNumber);
      alert('教师信息绑定成功！');
      setIsRebinding(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || '操作失败，请重试。';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理解除绑定的逻辑
  const handleUnbind = async () => {
    if (!window.confirm('您确定要解除与该教师信息的绑定吗？')) {
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await bindTeacherApi({ userId: user.userId, teacherId: null }); // 发送 teacherId: null
      clearUserTeacherId();
      alert('解除绑定成功！');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || '操作失败，请重试。';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 渲染绑定表单的函数
  const renderBindingForm = () => (
    <div className={styles.formContainer}>
      <h2>{isRebinding ? '更换绑定教师信息' : '绑定教师信息'}</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <i className={`fas fa-chalkboard-user ${styles.inputIcon}`}></i> {/* 换一个更合适的图标 */}
          <input
            type="number"
            id="teacherId"
            className={styles.inputField}
            placeholder="请输入教师ID"
            required
            {...teacherIdInput}
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

  // 如果用户未绑定，或者正在进行更换绑定
  if (!user || user.teacherId == null || isRebinding) {
    return renderBindingForm();
  }

  // 如果用户已绑定，则显示信息和操作按钮
  return (
    <div className={styles.formContainer}>
      <h2>教师信息</h2>
      <p>您当前绑定的教师ID为: <strong>{user.teacherId}</strong></p>

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

export default BindTeacherPage;