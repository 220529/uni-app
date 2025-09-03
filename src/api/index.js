/**
 * API统一导出文件
 * 将所有的API模块统一导出，方便业务层调用
 */

// 导入各个API模块
import { authAPI } from './auth.js';
import { userApi } from './user.js';
import { uploadApi } from './upload.js';
import http from './core/request.js';

// 导出核心请求工具
export { http };

// 导出各个API模块
export { authAPI } from './auth.js';
export { userApi } from './user.js';
export { uploadApi } from './upload.js';

// 统一导出对象，方便按模块调用
export default {
  auth: authAPI,
  user: userApi,
  upload: uploadApi,
  http,
};
