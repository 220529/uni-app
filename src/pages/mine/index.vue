<template>
  <view class="mine-container">
    <view class="top">
      <view class="header">
        <image class="avatar" :src="userInfo.avatar" />
        <view class="user-info">
          <view class="name">{{ userInfo.name }}</view>
          <view class="role">项目经理</view>
        </view>
      </view>

      <view class="box">
        <view class="stat-item">
          <view class="stat-num">{{ userInfo.completedNums }}</view>
          <view class="stat-label">已竣工</view>
        </view>
        <view class="stat-item">
          <view class="stat-num">{{ userInfo.constructionNums }}</view>
          <view class="stat-label">施工中</view>
        </view>
      </view>
    </view>
    <view class="item" @click="uni.navigateTo({ url: '/pages/mine/setup' })">
      <view class="item-title"> 设置 </view>
      <image class="item-img" src="@/static/svg/right_arrow.svg" />
    </view>
    
    <!-- 自定义tabbar -->
    <cpm-tabbar :path="currentPath" />
  </view>
</template>

<script>
import { store } from '../../store/index.js';
export default {
  name: 'MinePage',
  data() {
    return {
      currentPath: '/pages/mine/index',
      userInfo: store.userInfo,
    };
  },
  methods: {},
  async onLoad() {},
};
</script>
<style>
page {
  background: #f6f6f6;
}
</style>
<style scoped lang="scss">
.top {
  background: linear-gradient(180deg, #ffe9c3 0%, rgba(255, 255, 255, 0) 50%);
  padding: 0 30rpx;
  box-sizing: border-box;
}

.header {
  padding-top: 50rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 27rpx;

  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
  }

  .user-info {
    .name {
      font-size: 32rpx;
      color: #000000;
    }

    .role {
      opacity: 0.4;
      font-size: 28rpx;
      font-weight: normal;
      letter-spacing: 0px;
      color: #000000;
    }
  }
}

.box {
  margin-top: 40rpx;
  padding: 0 29rpx;
  box-sizing: border-box;
  border-radius: 14rpx;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 140rpx;

  .stat-item {
    width: 50%;

    text-align: center;

    .stat-num {
      font-size: 48rpx;
      color: rgba(0, 0, 0, 0.8);
      font-family: $font-jdzhenghei, sans-serif;
    }

    .stat-label {
      font-size: 22rpx;
      color: rgba(0, 0, 0, 0.4);
      margin-top: 5rpx;
    }
  }
}

.mine-container {
  /* tabbar占位空间现在由组件内部处理 */
}

.item {
  height: 88rpx;
  font-size: 28rpx;
  color: #000000;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 38rpx;
  box-sizing: border-box;
  margin-top: 30rpx;

  .item-img {
    width: 24rpx;
    height: 24rpx;
  }
}
</style>
