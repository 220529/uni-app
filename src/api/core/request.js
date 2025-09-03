import { requestInterceptor, responseInterceptor } from './interceptors.js';
import { tokenManager } from '@/auth/tokenManager.js';

// 简单去重队列
const pendingRequests = new Set();

// loading 计数器
let loadingCount = 0;
const showLoading = (title = '加载中...') => {
  if (loadingCount === 0) {
    uni.showLoading({ title, mask: true });
  }
  loadingCount++;
};
const hideLoading = () => {
  loadingCount = Math.max(loadingCount - 1, 0);
  if (loadingCount === 0) {
    uni.hideLoading();
  }
};

// 错误提示节流
let lastErrorTime = 0;
let lastErrorMessage = '';
const showError = (message) => {
  const now = Date.now();
  // 只有相同的错误信息且在1.5秒内才进行节流
  if (lastErrorMessage === message && now - lastErrorTime <= 1500) {
    return;
  }

  // 确保loading已经隐藏，避免与toast冲突
  uni.hideLoading();

  // 延迟一点显示toast，确保loading完全隐藏
  setTimeout(() => {
    uni.showToast({
      title: message,
      icon: 'error',
      duration: 3000,
      mask: true,
    });
  }, 50);

  lastErrorTime = now;
  lastErrorMessage = message;
};

// 生成请求key（对data做排序，避免顺序影响）
const getSortedString = (obj) => {
  if (!obj || typeof obj !== 'object') return String(obj);
  return JSON.stringify(
    Object.keys(obj)
      .sort()
      .reduce((r, k) => ((r[k] = obj[k]), r), {})
  );
};
const generateRequestKey = ({ url, method, data }) => {
  // 确保method存在且有值
  const safeMethod = (method || 'GET').toUpperCase();
  return `${safeMethod}_${url}_${getSortedString(data)}`;
};

/**
 * 核心请求方法
 * @param {Object} options 请求配置
 * @param {number} retryCount 重试次数
 * @returns {Promise}
 */
const request = (options, retryCount = 0) => {
  const MAX_RETRY_COUNT = 1;
  const RETRY_DELAY = 100; // ms

  return new Promise(async (resolve, reject) => {
    try {
      // 处理请求拦截器
      const processedOptions = await requestInterceptor(options);
      const requestKey = generateRequestKey(processedOptions);

      // 防重复请求（刷新重试除外）
      if (pendingRequests.has(requestKey) && !options._tokenRefreshed) {
        return;
      }
      pendingRequests.add(requestKey);

      // Loading处理
      if (options.loading !== false) {
        showLoading(options.loadingText);
      }

      uni.request({
        ...processedOptions,
        success: async (response) => {
          try {
            // 保存原始请求配置到响应中，供拦截器使用
            response.config = processedOptions;
            const result = await responseInterceptor(response);

            // Token刷新后重试
            if (result?.code === 'TOKEN_REFRESHED') {
              return handleTokenRefreshRetry(result.config, retryCount, resolve, reject);
            }

            if (result && result.code === 0) {
              resolve(result);
            } else {
              if (options.showError !== false) {
                showError(result.msg || result.message || '请求失败');
              }
              reject(result);
            }
          } catch (error) {
            // 检查是否为静默错误（如401未授权错误）
            if (options.showError !== false && !error.silent) {
              showError(error.message || '请求处理失败');
            }
            reject(createRequestError(error.message));
          } finally {
            pendingRequests.delete(requestKey);
            if (options.loading !== false) hideLoading();
          }
        },

        fail: (error) => {
          pendingRequests.delete(requestKey);
          if (options.loading !== false) hideLoading();

          const errorResult = createNetworkError(error);
          // 检查是否为静默错误
          if (options.showError !== false && !error.silent) {
            showError(errorResult.msg);
          }
          reject(errorResult);
        },
      });
    } catch (error) {
      const errorResult = createInterceptorError(error);
      // 检查是否为静默错误（如401未授权错误）
      if (options.showError !== false && !error.silent) {
        showError(errorResult.msg);
      }
      reject(errorResult);
    }
  });

  /**
   * 处理Token刷新后的重试
   * @param {Object} config 请求配置
   * @param {number} currentRetryCount 当前重试次数
   * @param {Function} resolve Promise resolve
   * @param {Function} reject Promise reject
   */
  async function handleTokenRefreshRetry(config, currentRetryCount, resolve, reject) {
    if (currentRetryCount >= MAX_RETRY_COUNT) {
      reject(createRequestError('重试次数超限'));
      return;
    }

    try {
      // 延迟重试
      await delay(RETRY_DELAY);

      // 重新发起请求
      const result = await request(config, currentRetryCount + 1);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  }
};

/**
 * 工具函数
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createRequestError(message) {
  return {
    code: -1,
    msg: message || '请求处理错误',
    data: null,
  };
}

function createNetworkError(error) {
  return {
    code: -1,
    msg: '网络连接失败，请检查网络设置',
    data: null,
    raw: error,
  };
}

function createInterceptorError(error) {
  return {
    code: -1,
    msg: '请求拦截器错误',
    data: null,
    raw: error,
  };
}

// 便捷方法
export const http = {
  get: (url, data = {}, options = {}) => request({ url, method: 'GET', data, ...options }),
  post: (url, data = {}, options = {}) => request({ url, method: 'POST', data, ...options }),
  put: (url, data = {}, options = {}) => request({ url, method: 'PUT', data, ...options }),
  delete: (url, data = {}, options = {}) => request({ url, method: 'DELETE', data, ...options }),
  request,
};

export default http;
