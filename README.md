# CPM微信小程序 v2

基于 uni-app + Vue3 的微信小程序项目

## 项目结构

```
src/
├── api/                    # API 接口层
│   ├── core/              # 核心请求配置
│   │   ├── index.js       # 统一导出
│   │   ├── request.js     # 请求封装
│   │   └── interceptors.js # 请求拦截器
│   ├── auth.js            # 认证相关API
│   ├── user.js            # 用户相关API
│   ├── upload.js          # 文件上传API
│   └── index.js           # API统一导出
├── auth/                  # 认证模块
│   ├── index.js           # 认证模块导出
│   ├── config.js          # 认证配置
│   └── tokenManager.js    # Token管理器
├── components/            # 公共组件
│   ├── cpm-textarea/      # 文本域组件
│   ├── cpm-file-upload/   # 文件上传组件
│   └── cpm-tabbar/        # 底部导航组件
├── pages/                 # 页面文件
│   ├── login/             # 登录页
│   ├── mine/              # 我的页面
│   ├── tools/demo/        # 组件示例页
│   ├── project-workflow/  # 项目工作流相关页面
│   └── legal/             # 法律条款页面
├── store/                 # 状态管理
├── utils/                 # 工具函数
│   ├── index.js           # 通用工具
│   ├── env.js             # 环境变量
│   ├── page.js            # 页面传参工具
│   ├── cache.js           # 缓存工具
│   ├── images.js          # 图片资源
│   ├── file.js            # 文件操作工具
│   ├── eventBus.js        # 事件总线
│   └── tabbar.js          # Tabbar配置
├── styles/                # 样式文件
├── config/                # 配置文件
├── App.vue               # 应用入口
├── main.js               # 主入口文件
├── pages.json            # 页面配置
└── manifest.json         # 应用配置
```

## 主要特性

- ✅ 完整的认证体系（Token管理、自动刷新）
- ✅ 统一的API请求封装
- ✅ 组件化开发（cpm-前缀组件）
- ✅ 代码规范（ESLint + Prettier）
- ✅ Git提交规范（Commitizen）

## 开发命令

```bash
# 安装依赖
pnpm install

# 微信小程序开发
pnpm run dev:wx

# 代码检查
pnpm run lint

# 代码格式化
pnpm run format

# 提交代码
pnpm run commit
```

## 组件使用

### cpm-textarea
```vue
<cpm-textarea 
  v-model="content" 
  placeholder="请输入内容"
  :maxlength="500"
  :show-count="true"
/>
```

### cpm-file-upload
```vue
<cpm-file-upload 
  v-model="fileList" 
  :max-count="9"
  accept="image,video"
/>
```

### cpm-tabbar
```vue
<cpm-tabbar path="/pages/mine/index" />
```

## API 使用

```javascript
import { userApi, authAPI, uploadApi } from '@/api';

// 获取用户信息
const userInfo = await userApi.getUserInfo();

// 登录
const result = await authAPI.login({ username, password });

// 文件上传
const uploadResult = await uploadApi.uploadFile(filePath, {
  url: '/admin-api/infra/file/upload',
  loadingText: '上传中...'
});
```

## 目录说明

- `components/` - 保留了3个核心组件，都以 `cpm-` 开头
- `pages/` - 保留了必要的页面：登录、我的、demo示例、工作人员页面、法律条款
- `api/` - 完整的API架构：core基础设施、auth认证、user用户示例

## 环境变量配置

1. **创建环境变量文件**
   ```bash
   # 复制示例文件
   cp .env.example .env
   
   # 根据不同环境创建对应文件
   cp .env.example .env.development
   cp .env.example .env.production
   ```

2. **环境变量说明**
   ```bash
   VITE_API_BASE_URL=https://api.example.com    # API基础地址
   VITE_TENANT_ID=1                             # 租户ID
   VITE_LOGIN_USER_TYPE=3                       # 登录用户类型
   VITE_TENCENT_MAP_KEY=your_key_here          # 腾讯地图密钥
   VITE_ENABLE_DEBUG=true                       # 调试开关
   ```

3. **使用环境变量**
   ```javascript
   import { API_BASE_URL, TENANT_ID, isDev } from '@/utils/env';
   
   console.log('API地址:', API_BASE_URL);
   console.log('是否开发环境:', isDev);
   ```

## 注意事项

1. 组件命名统一使用 `cpm-` 前缀
2. 页面路由配置在 `pages.json` 中
3. 环境变量配置参考 `.env.example` 文件
4. Token配置可在 `src/config/token.js` 中调整
5. **不要提交 `.env.local` 和 `.env.*.local` 文件到版本控制**
