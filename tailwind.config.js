/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 页面基底
        'steel-light': '#F2F5F8',
        'steel-white': '#FFFFFF',
        'steel-dark': '#1A222C',
        // 文字层级
        'carbon-black': '#121923',
        'steel-gray': '#44505E',
        'steel-light-gray': '#8A98A8',
        // 操作按钮主色
        'rock-blue': '#27394F',
        'rock-hover': '#344A66',
        // 状态标准冷色调
        'status-success': '#2D7D8C',
        'status-warn': '#B88648',
        'status-danger': '#9E4A4A',
        // 三级经销商角色标识
        'role-admin': '#635799',
        'role-provincial': '#2B5480',
        'role-city': '#4072A3',
      },
      borderRadius: {
        base: '4px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(26, 34, 44, 0.06)',
      },
      fontFamily: {
        sans: [
          'HarmonyOS Sans',
          'Noto Sans SC',
          'PingFang SC',
          'Microsoft YaHei',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      transitionTimingFunction: {
        'fade': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
