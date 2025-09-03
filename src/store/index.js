import { reactive } from 'vue';
import { userApi } from '@/api/user.js';
import { tokenManager } from '@/auth/tokenManager.js';

// 用户类型枚举
export const USER_TYPE = {
  PROJECT_MANAGER: 'project_manager', // 项目经理
  WORKER: 'worker', // 工人
};

// 全局状态
export const store = reactive({
  // 登录状态
  isLoggedIn: false,
  // 用户类型
  userType: null,
  // 用户信息
  userInfo: {
    name: '用户',
    avatar: '/static/logo.png',
    completedNums: 0,
    constructionNums: 0,
  },
});

// 登录方法
export const login = async (userId) => {
  try {
    const res = await userApi.getUserInfo({ userId });
    if (res?.code === 0 && res.data) {
      store.isLoggedIn = true;
      store.userInfo = { ...res.data };

      // 保存到本地存储
      uni.setStorageSync('userInfo', store.userInfo);
      uni.setStorageSync('isLoggedIn', true);

      // console.log('登录成功:', store.userInfo);
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    // 使用默认用户信息
    store.isLoggedIn = true;
    store.userInfo = {
      name: '用户',
      avatar: '/static/logo.png',
      completedNums: 0,
      constructionNums: 0,
    };
    uni.setStorageSync('userInfo', store.userInfo);
    uni.setStorageSync('isLoggedIn', true);
  }
};

// 登出方法
export const logout = () => {
  store.isLoggedIn = false;
  store.userType = null;
  store.userInfo = null;

  // 清除本地存储
  uni.removeStorageSync('userInfo');
  uni.removeStorageSync('isLoggedIn');

  // 清除token
  tokenManager.clearToken();

  console.log('登出成功');
};

// 检查是否在登录页面
const isOnLoginPage = () => {
  const pages = getCurrentPages();
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    return currentPage.route && currentPage.route.includes('login');
  }
  return false;
};

// 初始化状态（从本地存储恢复）
export const initStore = () => {
  const savedUserInfo = uni.getStorageSync('userInfo');
  const savedIsLoggedIn = uni.getStorageSync('isLoggedIn');

  // 如果有保存的登录信息，先恢复状态，让用户无感知
  if (savedIsLoggedIn && savedUserInfo) {
    store.isLoggedIn = true;
    store.userType = savedUserInfo.type;
    store.userInfo = savedUserInfo;
    // console.log('恢复登录状态:', store.userInfo);

    // 如果当前在登录页面，跳过token检查
    if (isOnLoginPage()) {
      console.log('当前在登录页面，跳过token检查');
      return;
    }

    // 延迟检查token有效性，避免启动时立即清除状态
    setTimeout(() => {
      // 再次检查是否在登录页面
      if (isOnLoginPage()) {
        console.log('延迟检查时仍在登录页面，跳过token检查');
        return;
      }

      // 静默检查token，如果无效则清除状态但不提示用户
      if (!tokenManager.isLoggedIn()) {
        console.log('Token已过期，静默清除登录状态');
        logout();
      }
    }, 3000); // 延迟3秒检查
  }
};
