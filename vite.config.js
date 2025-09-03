import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import path from 'path'

export default defineConfig(({ mode }) => {
  const root = process.cwd()
  loadEnv(mode, root) // 会自动挂到 import.meta.env
  return {
    plugins: [
      uni(),
      AutoImport({
        imports: ['vue', 'uni-app'],
      }),
      VueSetupExtend(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        // 解决 dayjs ESM 版本兼容问题
        'dayjs/esm/index': 'dayjs',
      },
    },

    optimizeDeps: {
      include: ['dayjs'], // 如果 dayjs 报错就保留，否则可以去掉
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },

    build: {
      minify: 'esbuild', // 用 esbuild 替代 terser，构建更快
      esbuild: {
        drop: ['console', 'debugger'],
      },
    },
  }
})
