// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.81.81:3000', // 你的后端服务地址
        changeOrigin: true,             // 需要虚拟主机站点
      },
    },
  },
})