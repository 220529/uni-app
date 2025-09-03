// import { AUTO_REFRESH_ENABLED, BUFFER_TIME, REDIRECT_DELAY } from '@/config/token.js';
import { authAPI } from '@/api/auth.js';

/**
 * Token管理类 - 精简版
 * 核心功能：自动刷新、并发控制、请求队列
 */
class TokenManager {
  constructor() {
    this.refreshPromise = null; // 缓存刷新Promise，避免并发刷新
    this.pendingQueue = []; // 等待队列
    this.redirecting = false; // 防重复跳转
    this.config = {
      enableAutoRefresh: true, // 是否启用自动刷新
      bufferTime: 5 * 60 * 1000, // 提前刷新时间 (5分钟)
      redirectDelay: 1000, // 跳转防抖延迟
    };
  }

  /**
   * 配置Token管理器
   * @param {Object} options 配置选项
   */
  configure(options = {}) {
    this.config = { ...this.config, ...options };
    return this;
  }

  /**
   * 切换自动刷新开关
   * @param {boolean} enabled 是否启用
   */
  setAutoRefresh(enabled) {
    this.config.enableAutoRefresh = enabled;
    return this;
  }

  /**
   * 获取有效Token（带自动刷新）
   */
  async getValidToken() {
    const token = this.getToken();
    if (!token) return null;

    // 如果在登录页面或禁用自动刷新，直接返回
    if (this.isOnLoginPage() || !this.config.enableAutoRefresh) {
      return this.isTokenExpired() ? null : token;
    }

    // 如果即将过期，主动刷新
    if (this.isTokenExpiringSoon()) {
      try {
        await this.refreshToken();
        return this.getToken();
      } catch (error) {
        return null;
      }
    }

    return token;
  }

  /**
   * 检查Token是否即将过期
   * @returns {boolean}
   */
  isTokenExpiringSoon() {
    const expiresTime = this.getExpiresTime();
    if (!expiresTime) return true;

    return Date.now() >= expiresTime - this.config.bufferTime;
  }

  // 检查是否在登录页面
  isOnLoginPage() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    return currentPage?.route?.includes('login') || false;
  }

  // 获取token
  getToken() {
    return uni.getStorageSync('token');
  }

  // 获取refreshToken
  getRefreshToken() {
    return uni.getStorageSync('refreshToken');
  }

  // 获取过期时间
  getExpiresTime() {
    return uni.getStorageSync('expiresTime');
  }

  // 保存token信息
  saveToken(tokenData) {
    const { userId, accessToken, refreshToken, expiresTime } = tokenData;
    uni.setStorageSync('token', accessToken);
    uni.setStorageSync('refreshToken', refreshToken);
    uni.setStorageSync('expiresTime', expiresTime);
    uni.setStorageSync('userId', userId);
  }

  // 清除token信息
  clearToken() {
    uni.removeStorageSync('token');
    uni.removeStorageSync('refreshToken');
    uni.removeStorageSync('expiresTime');
    uni.removeStorageSync('userId');
  }

  // 检查token是否过期（精确检查，不提前）
  isTokenExpired() {
    const expiresTime = this.getExpiresTime();
    if (!expiresTime) return true;
    return Date.now() >= expiresTime;
  }

  /**
   * 刷新Token（防并发）
   * @returns {Promise<Object>} Token数据
   */
  async refreshToken() {
    // 如果已有刷新Promise，直接等待
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // 创建刷新Promise
    this.refreshPromise = this._performRefresh();

    try {
      const result = await this.refreshPromise;
      this._processPendingQueue(null, result);
      return result;
    } catch (error) {
      this._processPendingQueue(error, null);
      throw error;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * 执行实际刷新
   * @returns {Promise<Object>}
   * @private
   */
  async _performRefresh() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      // 使用统一的认证API，避免循环依赖
      const response = await authAPI.refreshToken(refreshToken);

      if (response?.code === 0) {
        this.saveToken(response.data);
        console.log('Token刷新成功');
        return response.data;
      } else {
        throw new Error(response?.msg || 'Token refresh failed');
      }
    } catch (error) {
      console.error('Token刷新失败:', error);
      this.clearToken();
      this._safeRedirectToLogin();
      throw error;
    }
  }

  /**
   * 添加到等待队列
   * @param {Object} requestConfig 请求配置
   * @returns {Promise}
   */
  addToQueue(requestConfig) {
    return new Promise((resolve, reject) => {
      this.pendingQueue.push({
        config: requestConfig,
        resolve,
        reject,
      });
    });
  }

  /**
   * 处理等待队列
   * @param {Error|null} error 错误信息
   * @param {Object|null} tokenData Token数据
   * @private
   */
  _processPendingQueue(error, tokenData) {
    this.pendingQueue.forEach(({ config, resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        // 重新发起请求
        resolve({ ...config, _tokenRefreshed: true });
      }
    });
    this.pendingQueue = [];
  }

  /**
   * 安全跳转登录页（防重复跳转）
   */
  _safeRedirectToLogin() {
    if (this.redirecting) return;

    this.redirecting = true;

    // 延迟重置标志
    setTimeout(() => {
      this.redirecting = false;
    }, this.config.redirectDelay);

    // 检查当前是否已在登录页
    if (!this.isOnLoginPage()) {
      console.log('跳转到登录页...');
      uni.reLaunch({
        url: '/pages/login/index',
        fail: (error) => {
          console.error('跳转登录页失败:', error);
          this.redirecting = false;
        },
      });
    }
  }

  /**
   * 兼容旧版本的跳转方法
   * @deprecated 使用 _safeRedirectToLogin 替代
   */
  redirectToLogin() {
    this._safeRedirectToLogin();
  }

  /**
   * 检查登录状态（静默检查，不触发提示）
   * @returns {boolean}
   */
  isLoggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  /**
   * 用户主动操作时的登录检查
   * @returns {boolean}
   */
  checkLoginStatusForUserAction() {
    if (!this.isLoggedIn()) {
      // 如果禁用了自动刷新，直接提示并跳转
      if (!this.config.enableAutoRefresh) {
        uni.showModal({
          title: '登录状态',
          content: '您的登录状态已过期，请重新登录',
          showCancel: false,
          success: () => {
            this._safeRedirectToLogin();
          },
        });
        return false;
      }

      // 启用了自动刷新，让业务层处理
      return false;
    }
    return true;
  }

  /**
   * 应用恢复时检查Token状态
   */
  async checkOnAppResume() {
    if (this.isOnLoginPage() || !this.getToken()) {
      return true;
    }

    const needsRefresh = this.isTokenExpired() || this.isTokenExpiringSoon();

    if (needsRefresh && this.config.enableAutoRefresh) {
      try {
        await this.refreshToken();
        return true;
      } catch (error) {
        return false;
      }
    }

    return true;
  }

  /**
   * 清理资源
   */
  destroy() {
    this.pendingQueue = [];
    this.refreshPromise = null;
    this.redirecting = false;
  }
}

// 创建单例实例
export const tokenManager = new TokenManager();
