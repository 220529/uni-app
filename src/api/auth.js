/**
 * 认证相关API - 独立模块，避免循环依赖
 *
 * 设计原则：
 * 1. 不依赖request.js的拦截器，避免循环依赖
 * 2. 只处理认证相关的底层API调用
 * 3. 为tokenManager等核心模块提供服务
 */
import { API_BASE_URL, TENANT_ID } from '@/utils/env.js';

/**
 * 刷新Token（直接调用，不经过拦截器）
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshTokenAPI = (refreshToken) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE_URL}/system/auth/refresh-token?refreshToken=${refreshToken}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'tenant-id': TENANT_ID || '1',
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      },
      fail: reject,
    });
  });
};

/**
 * 登录API（直接调用，不经过拦截器）
 * @param {Object} data 登录数据
 * @returns {Promise<Object>}
 */
export const loginAPI = (data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE_URL}/app-api/system/auth/login`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'tenant-id': TENANT_ID || '1',
      },
      data,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      },
      fail: reject,
    });
  });
};

/**
 * 登出API（如果需要调用后端）
 * @returns {Promise<Object>}
 */
export const logoutAPI = () => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE_URL}/app-api/system/auth/logout`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'tenant-id': TENANT_ID || '1',
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      },
      fail: reject,
    });
  });
};

// 统一导出认证API
export const authAPI = {
  login: loginAPI,
  refreshToken: refreshTokenAPI,
  logout: logoutAPI,
};
