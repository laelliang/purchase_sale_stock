import commonjs from 'rollup-plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";

export default {
  input: 'src/index.ts', // 入口文件路径
  output: {
    // strict: false, //禁止严格模式
    file: 'dist/index.js', // 输出文件路径
    format: 'cjs', // 输出文件格式
    sourcemap: true
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json'
    }),
    json(),
    resolve(),// 支持node_modules
    commonjs()// 支持module
  ]
};
