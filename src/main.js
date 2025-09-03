import { createSSRApp } from 'vue';
import App from './App.vue';
import { initStore } from './store/index.js';
//⭐⭐ main.js 文件
import cpmTabbar from '@/components/cpm-tabbar/index.vue';

export function createApp() {
  const app = createSSRApp(App);
  app.component('cpm-tabbar', cpmTabbar);

  // 初始化状态管理
  initStore();

  return {
    app,
  };
}
