import { API_BASE_URL, TENANT_ID, LOGIN_USER_TYPE } from '@/utils/env.js';
import { tokenManager } from '@/auth/tokenManager.js';

/**
 * 请求拦截器
 * @param {Object} options 请求配置
 * @returns {Promise<Object>} 处理后的请求配置
 */
export const requestInterceptor = async (options) => {
  // 基本配置
  if (!options.method) {
    options.method = 'GET';
  }

  if (!options.url.startsWith('http')) {
    options.url = API_BASE_URL + options.url;
  }

  options.header = {
    'tenant-id': TENANT_ID || '1',
    login_user_type: LOGIN_USER_TYPE || '3',
    'Content-Type': 'application/json',
    ...options.header,
  };

  // 跳过登录页和刷新token接口的token检查
  if (isSkipTokenCheck(options.url)) {
    return options;
  }

  try {
    // 获取有效Token（如果启用自动刷新，会主动刷新即将过期的token）
    const token = await tokenManager.getValidToken();
    if (token) {
      options.header.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    // Token获取失败，但继续发送请求（让服务器返回401）
    console.warn('Token获取失败:', error.message);
  }

  return options;
};

/**
 * 响应拦截器
 * @param {Object} response 响应对象
 * @returns {Promise<Object>} 处理后的响应数据
 */
export const responseInterceptor = async (response) => {
  const { statusCode, data } = response;

  // HTTP状态码检查
  if (statusCode < 200 || statusCode >= 300) {
    if (statusCode === 401) {
      return handleUnauthorized(response.config);
    }
    return createErrorResponse(statusCode, getHttpErrorMessage(statusCode));
  }

  // 业务状态码检查
  if (data && typeof data.code !== 'undefined') {
    if (data.code === 0) {
      return data; // 成功
    } else if (data.code === 401) {
      return handleUnauthorized(response.config);
    }
    return createErrorResponse(data.code, data.msg || data.message);
  }

  return data;
};

/**
 * 处理401错误
 * @param {Object} requestConfig 原始请求配置
 * @returns {Promise<Object>}
 */
async function handleUnauthorized(requestConfig) {
  const refreshToken = tokenManager.getRefreshToken();

  // 如果没有refreshToken或禁用了自动刷新，直接跳转登录
  if (!refreshToken || !tokenManager.config.enableAutoRefresh) {
    tokenManager._safeRedirectToLogin();
    // 创建一个特殊的错误对象，标记为静默错误（不显示toast）
    const error = new Error('未授权，请重新登录');
    error.silent = true;
    throw error;
  }

  try {
    // 如果正在刷新，加入队列等待
    if (tokenManager.refreshPromise) {
      const newConfig = await tokenManager.addToQueue(requestConfig);
      return { code: 'TOKEN_REFRESHED', config: newConfig };
    }

    // 执行刷新
    await tokenManager.refreshToken();
    return {
      code: 'TOKEN_REFRESHED',
      config: { ...requestConfig, _tokenRefreshed: true },
    };
  } catch (error) {
    tokenManager._safeRedirectToLogin();
    // 创建一个特殊的错误对象，标记为静默错误（不显示toast）
    const silentError = new Error('登录已过期，请重新登录');
    silentError.silent = true;
    throw silentError;
  }
}

/**
 * 工具函数 - 检查是否跳过token检查
 * @param {string} url 请求URL
 * @returns {boolean}
 */
function isSkipTokenCheck(url) {
  const skipUrls = ['/login', '/refresh-token'];
  return skipUrls.some((skipUrl) => url.includes(skipUrl));
}

/**
 * 工具函数 - 创建错误响应
 * @param {number} code 错误码
 * @param {string} message 错误信息
 * @returns {Object}
 */
function createErrorResponse(code, message) {
  return {
    success: false,
    code,
    message,
    data: null,
  };
}

/**
 * HTTP 错误消息映射
 * @param {number} statusCode HTTP状态码
 * @returns {string} 错误信息
 */
function getHttpErrorMessage(statusCode) {
  const errorMessages = {
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求地址不存在',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时',
  };
  return errorMessages[statusCode] || '网络请求失败';
}
