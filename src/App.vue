<script>
import { store } from './store/index.js';
import { checkOnAppResume } from './auth/config.js';

export default {
  onLaunch: function () {
    console.log('App Launch');
    // 检查登录状态
    this.checkLoginStatus();
  },

  onShow: async function () {
    console.log('📱 App Show - 应用恢复到前台');

    // 应用恢复时检查Token状态
    try {
      const success = await checkOnAppResume();
      if (success) {
        console.log('📱 Token状态正常，用户可正常使用');
      } else {
        console.log('📱 Token恢复失败，用户可能需要重新登录');
      }
    } catch (error) {
      console.error('📱 Token状态检查出错:', error);
    }
  },

  onHide: function () {
    console.log('📱 App Hide - 应用进入后台');
  },

  methods: {
    checkLoginStatus() {
      // 获取存储的token
      const token = uni.getStorageSync('token');
      const userInfo = uni.getStorageSync('userInfo');

      if (token && userInfo) {
        // 如果已登录，跳转到首页（项目经理tabbar）
        uni.switchTab({
          url: '/pages/index/index',
        });
      } else {
        // 如果未登录，跳转到登录页
        uni.reLaunch({
          url: '/pages/login/index',
        });
      }
    },
  },
};
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
/* 已移除 uview-plus 样式依赖 */
</style>
