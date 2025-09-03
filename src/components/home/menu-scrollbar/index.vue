<template>
  <scroll-view class="menu-scrollbar" scroll-x enable-flex>
    <view class="menu-container">
      <view class="menu-item" v-for="item in menuItems" :key="item.id" @click="handleItemClick(item)">
        <image class="menu-icon" :src="item.icon" />
        <text class="menu-text">{{ item.title }}</text>
      </view>
      <!-- 添加一个空的占位元素，确保右侧有边距 -->
      <view class="menu-spacer"></view>
    </view>
  </scroll-view>
</template>

<script setup>
import { computed } from 'vue';
import images from '@/utils/images';

// 默认菜单配置
const defaultMenuItems = [
  { id: 'live', title: '工地直播', icon: images.home.r1 },
  { id: 'archive', title: '装修档案', icon: images.home.r2 },
  { id: 'team', title: '服务团队', icon: images.home.r3 },
  { id: 'monitor', title: '一起盯工', icon: images.home.r4 },
  { id: 'broadcast', title: '工地播报', icon: images.home.r5 },
];

// 计算菜单项（后续可以根据用户状态或权限动态调整）
const menuItems = computed(() => {
  // 这里可以根据用户状态过滤菜单项
  return defaultMenuItems;
});

// 菜单项点击处理
const handleItemClick = (item) => {
  console.log('菜单点击:', item);

  switch (item.id) {
    case 'live':
      console.log('跳转工地直播');
      break;
    case 'archive':
      uni.navigateTo({
        url: '/pages/decoration-archive/index',
      });
      break;
    case 'team':
      uni.navigateTo({
        url: '/pages/work-persons/index',
        success: () => {
          uni.setStorageSync('team_params', {
            projectId: 'current_project',
            source: 'home',
          });
        },
      });
      break;
    case 'monitor':
      console.log('一起盯工 - 暂未实现');
      break;
    case 'broadcast':
      uni.navigateTo({
        url: '/pages/broadcast-detail/index',
      });
      break;
  }
};
</script>

<style scoped lang="scss">
.menu-scrollbar {
  margin-top: 37rpx;
  width: 100%;
  white-space: nowrap;

  .menu-container {
    display: flex;
    flex-direction: row;

    .menu-item {
      flex-shrink: 0;
      width: 126rpx;
      height: 148rpx;
      background: #ffffff;
      border-radius: 14rpx 40rpx 14rpx 14rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .menu-icon {
        width: 72rpx;
        height: 72rpx;
      }

      .menu-text {
        font-family: Source Han Sans;
        font-size: 24rpx;
        font-weight: normal;
        text-align: center;
      }
      margin-right: 30rpx;
    }
    
    // 右侧占位元素 - 确保有足够的宽度
    .menu-spacer {
      flex-shrink: 0;
      width: 1rpx;
      height: 148rpx; // 与菜单项高度一致，确保视觉上的一致性
    }
  }
}
</style>
