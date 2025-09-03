# CPM微信小程序 v2

> 基于 uni-app + Vue3 开发的企业级微信小程序，具备完整的工程化配置和智能认证管理机制

## ⚡ 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run dev:wx

# 构建生产环境
pnpm run build:mp-weixin
```

## 📁 项目结构

```
src/
├── api/              # API 接口层
├── auth/             # 认证模块
├── components/       # 公共组件
├── pages/            # 页面文件
├── utils/            # 工具函数
└── store/            # 状态管理
```

## ✨ 主要特性

- 🔐 智能Token管理（自动刷新）
- 🌐 统一API封装
- 🧩 组件化开发（cpm- 前缀）
- 🔧 完整工程化配置

## 🔧 开发命令

```bash
pnpm run dev:wx    # 开发模式
pnpm run build:mp-weixin  # 生产构建
pnpm run lint      # 代码检查
pnpm run commit    # 规范提交
```

> 详细开发规范请查看 [开发规范.md](./开发规范.md)

## 📦 组件使用

```vue
<!-- 核心组件 (cpm- 前缀) -->
<cpm-textarea v-model="content" />
<cpm-file-upload v-model="fileList" />
<cpm-tabbar path="/pages/mine/index" />
```

## 🔌 API 使用

```javascript
import { userApi, authAPI, uploadApi } from '@/api';

const userInfo = await userApi.getUserInfo();
const result = await authAPI.login({ username, password });
const uploadResult = await uploadApi.uploadFile(filePath);
```

## 🌍 环境变量配置

```bash
VITE_API_BASE_URL=https://api.example.com
VITE_TENANT_ID=1
VITE_ENABLE_DEBUG=true
```

```javascript
// 使用
import { API_BASE_URL, isDev } from '@/utils/env';
```

## ⚠️ 注意事项

- 组件统一使用 `cpm-` 前缀
- 页面配置在 `pages.json` 中
- 不要提交 `.env.local` 文件
