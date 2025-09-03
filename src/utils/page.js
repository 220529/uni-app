/**
 * 页面传参和接收参数的工具方法集合
 * 兼容Vue2和Vue3
 */

import { savePageCache, getPageCache, clearPageCache } from './cache';

/**
 * 编码参数对象为URL安全的字符串
 * @param {Object} params - 要传递的参数对象
 * @returns {string} 编码后的参数字符串
 */
export function encodeParams(params) {
  try {
    return encodeURIComponent(JSON.stringify(params));
  } catch (error) {
    console.error('编码参数失败:', error);
    return '';
  }
}

/**
 * 解码URL参数字符串为对象
 * @param {string} encodedParams - 编码后的参数字符串
 * @returns {Object|null} 解码后的参数对象，失败时返回null
 */
export function decodeParams(encodedParams) {
  try {
    if (!encodedParams) return null;
    return JSON.parse(decodeURIComponent(encodedParams));
  } catch (error) {
    console.error('解码参数失败:', error);
    return null;
  }
}

/**
 * 构建带参数的页面跳转URL
 * @param {string} pagePath - 页面路径
 * @param {Object} params - 要传递的参数对象
 * @returns {string} 完整的页面跳转URL
 */
export function buildPageUrl(pagePath, params = {}) {
  if (!params || Object.keys(params).length === 0) {
    return pagePath;
  }

  const encodedParams = encodeParams(params);
  return `${pagePath}?params=${encodedParams}`;
}

/**
 * 获取当前页面的参数（兼容Vue2和Vue3）
 * @param {Object} pageInstance - 页面实例（可选，不传则自动获取）
 * @returns {Object|null} 页面参数对象
 */
export function getCurrentPageParams(pageInstance = null) {
  try {
    let currentPage;

    if (pageInstance) {
      currentPage = pageInstance;
    } else {
      // 兼容Vue2和Vue3的页面实例获取方式
      if (typeof getCurrentPages === 'function') {
        const pages = getCurrentPages();
        currentPage = pages[pages.length - 1];
      } else {
        console.warn('无法获取当前页面实例');
        return null;
      }
    }

    if (!currentPage || !currentPage.options) {
      return null;
    }

    const params = currentPage.options.params;
    return decodeParams(params);
  } catch (error) {
    console.error('获取页面参数失败:', error);
    return null;
  }
}

/**
 * 页面跳转并传递参数（兼容Vue2和Vue3）
 * @param {Object} options - 跳转选项
 * @param {string} options.url - 页面路径
 * @param {Object} options.params - 要传递的参数对象
 * @param {string} options.type - 跳转类型：'navigate'|'redirect'|'reLaunch'|'switchTab'，默认为'navigate'
 */
export function navigateWithParams(options) {
  try {
    const { url, params = {}, type = 'navigate' } = options;

    if (!url) {
      console.error('页面路径不能为空');
      return;
    }

    const fullUrl = buildPageUrl(url, params);

    // 在uni-app中，uni对象通常是全局可用的
    if (typeof uni === 'undefined') {
      console.error('uni对象未定义，请检查运行环境');
      return;
    }

    switch (type) {
      case 'redirect':
        uni.redirectTo({ url: fullUrl });
        break;
      case 'reLaunch':
        uni.reLaunch({ url: fullUrl });
        break;
      case 'switchTab':
        uni.switchTab({ url: fullUrl });
        break;
      case 'navigate':
      default:
        uni.navigateTo({ url: fullUrl });
        break;
    }
  } catch (error) {
    console.error('页面跳转失败:', error);
  }
}

/**
 * 在页面组件中获取参数的便捷方法（用于Vue组件内部）
 * @param {Object} vm - Vue组件实例
 * @returns {Object|null} 页面参数对象
 */
export function getPageParams(vm) {
  try {
    if (!vm) {
      console.warn('Vue组件实例不能为空');
      return null;
    }

    // 兼容Vue2和Vue3的$mp属性
    const options = vm.$mp?.options || vm.$options?.mpOptions || {};
    const params = options.params;

    return decodeParams(params);
  } catch (error) {
    console.error('获取页面参数失败:', error);
    return null;
  }
}

/**
 * 检查参数是否有效
 * @param {Object} params - 参数对象
 * @returns {boolean} 参数是否有效
 */
export function isValidParams(params) {
  return params !== null && params !== undefined && typeof params === 'object';
}

/**
 * 获取参数中的特定字段，带默认值
 * @param {Object} params - 参数对象
 * @param {string} key - 字段名
 * @param {*} defaultValue - 默认值
 * @returns {*} 字段值或默认值
 */
export function getParamValue(params, key, defaultValue = null) {
  if (!isValidParams(params)) {
    return defaultValue;
  }

  return params[key] !== undefined ? params[key] : defaultValue;
}

/**
 * 合并参数对象
 * @param {Object} baseParams - 基础参数对象
 * @param {Object} additionalParams - 额外参数对象
 * @returns {Object} 合并后的参数对象
 */
export function mergeParams(baseParams = {}, additionalParams = {}) {
  return {
    ...baseParams,
    ...additionalParams,
  };
}

/**
 * 页面跳转并保存数据到缓存（推荐使用）
 * @param {Object} options - 跳转选项
 * @param {string} options.url - 页面路径
 * @param {Object} options.data - 要保存到缓存的数据
 * @param {string} options.type - 跳转类型：'navigate'|'redirect'|'reLaunch'|'switchTab'，默认为'navigate'
 */
export function navigateWithCache(options) {
  try {
    const { url, data = {}, type = 'navigate' } = options;

    if (!url) {
      console.error('页面路径不能为空');
      return;
    }

    // 保存数据到缓存
    if (Object.keys(data).length > 0) {
      savePageCache(url, data);
    }

    // 执行页面跳转
    if (typeof uni === 'undefined') {
      console.error('uni对象未定义，请检查运行环境');
      return;
    }

    switch (type) {
      case 'redirect':
        uni.redirectTo({ url });
        break;
      case 'reLaunch':
        uni.reLaunch({ url });
        break;
      case 'switchTab':
        uni.switchTab({ url });
        break;
      case 'navigate':
      default:
        uni.navigateTo({ url });
        break;
    }
  } catch (error) {
    console.error('页面跳转失败:', error);
  }
}

/**
 * 获取当前页面的缓存数据
 * @param {string} pagePath - 页面路径（可选，不传则自动获取当前页面路径）
 * @returns {Object|null} 缓存的数据或null
 */
export function getCurrentPageCache(pagePath = null) {
  return getPageCache(pagePath);
}

/**
 * 清除当前页面的缓存数据
 * @param {string} pagePath - 页面路径（可选，不传则自动获取当前页面路径）
 * @returns {boolean} 是否清除成功
 */
export function clearCurrentPageCache(pagePath = null) {
  return clearPageCache(pagePath);
}

// 导出默认对象，包含所有方法
export default {
  encodeParams,
  decodeParams,
  buildPageUrl,
  getCurrentPageParams,
  navigateWithParams,
  navigateWithCache,
  getPageParams,
  getCurrentPageCache,
  clearCurrentPageCache,
  isValidParams,
  getParamValue,
  mergeParams,
};
