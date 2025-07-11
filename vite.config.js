// my-frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 将 /api 开头的请求代理到后端的 3000 端口
      '/api': {
        target: 'http://localhost:3000', // 你的后端服务地址
        changeOrigin: true,             // 需要虚拟主机站点
        // 可选：如果你的后端 API 没有 /api 前缀，可以重写路径
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})