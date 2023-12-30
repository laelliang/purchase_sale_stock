import { join } from "path";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { VantResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  // build: {
  //   rollupOptions: {
  //     output: {
  //       // 在生产环境中保留 console.log
  //       intro: "if (!window._IS_PRODUCTION_) window._IS_PRODUCTION_ = false;",
  //     },
  //   },
  // },
  server: {
    host: '0.0.0.0',
    port: 3333,
    proxy: {
      '/api': {
        target: 'http://localhost:3333',  // 目标服务器的地址
        changeOrigin: true,  // 是否改变源地址
        rewrite: path => {
          return path.replace(/^\/api/, '')
        }
      },
      // '/api': {
      //   target: 'http://10.168.2.161:80',  // 目标服务器的地址
      //   changeOrigin: true,  // 是否改变源地址
      //   rewrite: path => {
      //     return path
      //   }
      // },
      '/net': {
        target: 'http://localhost:5021',  // 目标服务器的地址
        changeOrigin: true,  // 是否改变源地址
        rewrite: path => {
          return path.replace(/^\/net/, '')
        }
      },
    }
  },
  resolve: {
    alias: {
      '@': join(__dirname, "src"),
      '@router': join(__dirname, "router"),
      '@store': join(__dirname, "store"),
    }
  },
  plugins: [
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
        VantResolver()
      ],
    }),
    vue()
  ],
})
