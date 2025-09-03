<template>
  <view class="construction-progress">
    <view class="progress-header" :style="{ backgroundImage: `url(${images.home.h2})` }">
      <view class="header-content">
        <view class="progress-info">
          <view class="progress-title">开工交底</view>
          <view class="progress-desc">工程师正在为您详细介绍施工计划</view>
        </view>
        
        <view class="contact-section">
          <image class="avatar" :src="images.home.p1" />
          <view class="contact-info">
            <view class="contact-name">张工程师</view>
            <view class="contact-role">项目负责人</view>
          </view>
          <image class="call-btn" :src="images.home.call" @click="makeCall" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import images from '@/utils/images';

// 拨打电话
const makeCall = () => {
  uni.makePhoneCall({
    phoneNumber: '10086'
  });
};
</script>

<style scoped lang="scss">
.construction-progress {
  margin: 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
  
  .progress-header {
    background-size: cover;
    background-position: center;
    padding: 40rpx;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
    }
    
    .header-content {
      position: relative;
      z-index: 1;
      
      .progress-info {
        text-align: center;
        margin-bottom: 40rpx;
        
        .progress-title {
          font-size: 48rpx;
          font-weight: bold;
          color: white;
          margin-bottom: 15rpx;
        }
        
        .progress-desc {
          font-size: 28rpx;
          color: rgba(255, 255, 255, 0.9);
        }
      }
      
      .contact-section {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 20rpx;
        padding: 30rpx;
        backdrop-filter: blur(10rpx);
        
        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
        
        .contact-info {
          flex: 1;
          
          .contact-name {
            font-size: 32rpx;
            font-weight: bold;
            color: white;
            margin-bottom: 5rpx;
          }
          
          .contact-role {
            font-size: 24rpx;
            color: rgba(255, 255, 255, 0.8);
          }
        }
        
        .call-btn {
          width: 60rpx;
          height: 60rpx;
          
          &:active {
            transform: scale(0.9);
            transition: transform 0.1s;
          }
        }
      }
    }
  }
}
</style>
