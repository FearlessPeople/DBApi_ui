import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      fs: {
        strict: true,
      },
      // 如果本地开发运行，可开启如下，访问后端api接口服务
      proxy: {
        '/api': {
          target: 'http://localhost:8088/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false, // 对于开发环境中使用 HTTP
          ws: true, // 如果需要支持 WebSocket
          headers: {
            // 'X-Custom-Header': 'my-custom-header-value',
          },
        },
      },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConfig
);
