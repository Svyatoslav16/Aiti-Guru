import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';

const PROXY_URL = 'https://dummyjson.com';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@api': path.resolve(__dirname, './src/api'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@schemas': path.resolve(__dirname, './src/schemas'),
    },
  },

  server: {
    proxy: {
      '/api': {
        target: PROXY_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', PROXY_URL);
          });
          proxy.on('proxyRes', (proxyRes) => {
            // Добавляем заголовки для ответа
            proxyRes.headers['access-control-allow-origin'] = '*';
            proxyRes.headers['access-control-allow-credentials'] = 'true';
          });
        },
      },
    },
  },
});
