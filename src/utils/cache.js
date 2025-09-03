/**
 * 页面缓存工具
 * 提供页面间数据传递的缓存功能
 */

const CACHE_KEY_PREFIX = 'page_cache_';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5分钟过期

/**
 * 保存页面缓存数据
 * @param {string} pagePath 页面路径
 * @param {Object} data 要缓存的数据
 */
export function savePageCache(pagePath, data) {
  try {
    const cacheKey = CACHE_KEY_PREFIX + pagePath;
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    uni.setStorageSync(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error('保存页面缓存失败:', error);
  }
}

/**
 * 获取页面缓存数据
 * @param {string} pagePath 页面路径，如果不传则获取当前页面路径
 * @returns {Object|null} 缓存的数据或null
 */
export function getPageCache(pagePath = null) {
  try {
    const targetPath = pagePath || getCurrentPagePath();
    if (!targetPath) return null;

    const cacheKey = CACHE_KEY_PREFIX + targetPath;
    const cacheString = uni.getStorageSync(cacheKey);
    
    if (!cacheString) return null;

    const cacheData = JSON.parse(cacheString);
    
    // 检查是否过期
    if (Date.now() - cacheData.timestamp > CACHE_EXPIRY) {
      clearPageCache(targetPath);
      return null;
    }

    return cacheData.data;
  } catch (error) {
    console.error('获取页面缓存失败:', error);
    return null;
  }
}

/**
 * 清除页面缓存数据
 * @param {string} pagePath 页面路径，如果不传则清除当前页面缓存
 * @returns {boolean} 是否清除成功
 */
export function clearPageCache(pagePath = null) {
  try {
    const targetPath = pagePath || getCurrentPagePath();
    if (!targetPath) return false;

    const cacheKey = CACHE_KEY_PREFIX + targetPath;
    uni.removeStorageSync(cacheKey);
    return true;
  } catch (error) {
    console.error('清除页面缓存失败:', error);
    return false;
  }
}

/**
 * 获取当前页面路径
 * @returns {string|null} 当前页面路径或null
 */
function getCurrentPagePath() {
  try {
    if (typeof getCurrentPages === 'function') {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      return currentPage?.route || null;
    }
    return null;
  } catch (error) {
    console.error('获取当前页面路径失败:', error);
    return null;
  }
}

/**
 * 清除所有过期的页面缓存
 */
export function clearExpiredPageCache() {
  try {
    const storageInfo = uni.getStorageInfoSync();
    const now = Date.now();
    
    storageInfo.keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        try {
          const cacheString = uni.getStorageSync(key);
          const cacheData = JSON.parse(cacheString);
          
          if (now - cacheData.timestamp > CACHE_EXPIRY) {
            uni.removeStorageSync(key);
          }
        } catch (error) {
          // 如果数据格式错误，直接删除
          uni.removeStorageSync(key);
        }
      }
    });
  } catch (error) {
    console.error('清除过期缓存失败:', error);
  }
}
