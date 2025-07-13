// src/pages/ChangeUsernamePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeUsername as changeUsernameApi } from '../services/api'; // 导入修改用户名的 API
import { useAuth } from '../context/AuthContext';

const ChangeUsernamePage = () => {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { userId } = useAuth();

  const errorMessages = {
  'Duplicate username': '该用户名已被使用，请换一个试试。',
  'User not found': '用户不存在，请确认账号信息。',
  'Missing parameters': '提交的信息不完整，请检查。',
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 基础校验
    if (!newName.trim()) {
      setError('新用户名不能为空');
      return;
    }
    if (newName.trim().length < 2) {
      setError('新用户名长度不能少于2位');
      return;
    }

    setIsLoading(true);

        try {

              const response = await changeUsernameApi({
                userid: userId,
                new_name: newName.trim(),
              });


              if (response.data && response.data.success === 1) {
                setSuccess(response.data.message || '用户名修改成功！2秒后将返回仪表盘。');
                setTimeout(() => {
                  navigate('/dashboard');
                }, 2000);
              } else {
                    const backendError = response.data.error;
                    const displayError = errorMessages[backendError] || backendError || '操作失败，未知错误。';
                    setError(displayError);
              }

            } catch (err) {
                      const backendError = err.response?.data?.error;
                      const displayError = errorMessages[backendError] || backendError || '用户名修改失败，请重试。';
                      setError(displayError);
            } finally {
              setIsLoading(false);
            }
          };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>修改用户名</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>新用户名:</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            placeholder="请输入新的用户名"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
          {isLoading ? '正在提交...' : '确认修改'}
        </button>
      </form>
    </div>
  );
};

export default ChangeUsernamePage;