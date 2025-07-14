import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../App.module.css';
import { useAuth } from '../context/AuthContext';
import { bindStudent as bindStudentApi } from '../services/api';
import { useNumericInput } from '../hooks/useNumericInput';

// 建议将组件名与文件名统一
const BindStudentPage = () => {
  const studentIdInput = useNumericInput('');
  const [studentId, setStudentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, updateUserStudentId } = useAuth();
  const navigate = useNavigate();

  const errorMessages = {
    'User not found': '用户不存在。',
    'Missing parameters': '提交的信息不完整，请检查。',
  };

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
      navigate('/dashboard');
    } catch (err) {
      const backendError = err.response?.data?.error;
      const displayError = errorMessages[backendError] || backendError || '登录失败，请重试。';
      setError(displayError);
    } finally {
      setIsLoading(false);
    }
  };

  if (user && user.studentId != null) { // 使用 != null 来正确处理 ID 为 0 的情况
    return (
      <div className={styles.formContainer}>
        <h2>学生信息</h2>
        <p>您已成功绑定学生ID: <strong>{user.studentId}</strong></p>
        <p>如需修改，请联系管理员。</p>
        <Link to="/dashboard" className={`${styles.btn} ${styles.btnSecondary}`}>
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      {/* 标题保持不变 */}
      <h2>绑定学生信息</h2>

        <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <i className={`fas fa-id-card ${styles.inputIcon}`}></i>
                <input
                    type="number"
                    id="studentId"
                    className={styles.inputField}
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="请输入您的学生ID"
                    required
                    {...studentIdInput}



                />
            </div>

            {/* 错误信息和按钮保持不变 */}
            {error && <p className={styles.errorMessage}>{error}</p>}

            <button
                type="submit"
                className={`${styles.btn} ${styles.btnPrimary} ${styles.submitButton}`} // 使用和登录按钮一致的 class
                disabled={isLoading}
            >
                {isLoading ? '正在绑定...' : '确认绑定'}
            </button>
        </form>

        <Link to="/dashboard" className={`${styles.btn} ${styles.btnSecondary}`} style={{marginTop: '1rem'}}>
            稍后绑定
        </Link>
    </div>
  );
};

export default BindStudentPage;