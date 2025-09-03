<template>
  <view class="tabbar-wrapper">
    <!-- 占位元素，为固定定位的tabbar预留空间 -->
    <view class="tabbar-placeholder"></view>
    
    <!-- 实际的tabbar -->
    <view class="tabbar-container">
      <view 
        v-for="(item, index) in list" 
        :key="index" 
        class="tabbar-item" 
        :class="{ 'tabbar-item--active': isActive(item.pagePath) }" 
        @click="switchTab(item.pagePath)"
      >
        <image 
          class="tabbar-item__icon" 
          :src="isActive(item.pagePath) ? item.selectedIconPath : item.iconPath"
        />
        <view 
          class="tabbar-item__text" 
          :style="{ color: isActive(item.pagePath) ? selectedColor : color }"
        >
          {{ item.text }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import pagesConfig from '@/pages.json';

export default {
  props: {
    path: {
      type: String,
      default: '/pages/index/index',
    },
  },
  
  computed: {
    // 从pages.json读取tabbar配置
    tabBarConfig() {
      return pagesConfig.tabBar || {};
    },
    
    // 处理tabbar列表，添加路径前缀
    list() {
      const tabList = this.tabBarConfig.list || [];
      return tabList.map(item => ({
        ...item,
        pagePath: `/${item.pagePath}`,
        iconPath: `../../${item.iconPath}`,
        selectedIconPath: `../../${item.selectedIconPath}`
      }));
    },
    
    // 从配置读取颜色
    color() {
      return this.tabBarConfig.color || '#666666';
    },
    
    selectedColor() {
      return this.tabBarConfig.selectedColor || '#1677FF';
    }
  },

  methods: {
    isActive(pagePath) {
      return this.path === pagePath;
    },
    
    switchTab(pagePath) {
      uni.switchTab({ url: pagePath });
    },
  },
};
</script>

<style scoped lang="scss">
.tabbar-wrapper {
  // 占位元素：确保页面内容不被固定tabbar遮挡
  .tabbar-placeholder {
    height: calc(88rpx + 36rpx + env(safe-area-inset-bottom));
    // 计算说明：
    // 88rpx: tabbar项目高度
    // 36rpx: tabbar上下内边距 (18rpx × 2) 
    // env(safe-area-inset-bottom): iOS安全区域适配
  }
  
  // 实际tabbar容器：固定在底部
  .tabbar-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18rpx 82rpx calc(env(safe-area-inset-bottom) + 18rpx);
    box-sizing: border-box;
    border-top: 1rpx solid #d8d8d8;
    z-index: 1000; // 确保在最顶层
  }
  
  // tabbar单个项目
  .tabbar-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 88rpx;
    height: 88rpx;
    border-radius: 8rpx;
    transition: background-color 0.2s ease;
    
    // 图标样式
    &__icon {
      width: 42rpx;
      height: 42rpx;
    }
    
    // 文本样式
    &__text {
      font-size: 20rpx;
      margin-top: 6rpx;
      text-align: center;
    }
    
    // 激活状态
    &--active {
      background-color: rgba(22, 119, 255, 0.1);
    }
  }
}
</style>
