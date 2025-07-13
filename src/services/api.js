// src/services/api.js

import axios from 'axios';

// 从环境变量中获取后端 API 的基础 URL
const API_URL = import.meta.env.VITE_API_BASE_URL;

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器，在每个请求头中加入 token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = (credentials) => apiClient.post('/api/auth/login', credentials);
export const register = (userData) => apiClient.post('/api/auth/register', userData);
export const changePassword = (update4pwd) => apiClient.post('/api/user/update_pwd', update4pwd);
export const changeUsername = (update4name) => apiClient.post('/api/user/update_name', update4name);




export const getStudentLearningBehavior = (studentId) => {

  return apiClient.get(`/api/student/${studentId}/learningBehavior`);
};


// 获取受保护的仪表盘数据（如果需要的话）
export const getDashboardData = () => apiClient.get('/dashboard-data');

export default apiClient;