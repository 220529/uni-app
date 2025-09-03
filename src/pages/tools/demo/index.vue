<template>
  <view class="container">
    <view class="header">
      <text class="title">开发工具页面</text>
      <text class="subtitle">Vue3 组件示例：{{ count }}</text>
    </view>
    
    <view class="demo-section">
      <view class="demo-item" @click="onClick">
        <text class="demo-text">点击计数器：{{ count }}</text>
        <text class="demo-desc">点我增加计数</text>
      </view>
    </view>

    <view class="tools-section">
      <view class="section-title">测试工具</view>
      
      <view class="tool-item" @click="goToComponentTest">
        <view class="tool-icon">🧪</view>
        <view class="tool-info">
          <text class="tool-name">组件测试</text>
          <text class="tool-desc">测试 CPM 组件库的功能</text>
        </view>
        <view class="tool-arrow">></view>
      </view>
      
      <view class="tool-item" @click="testPageParams">
        <view class="tool-icon">📄</view>
        <view class="tool-info">
          <text class="tool-name">页面参数测试</text>
          <text class="tool-desc">测试页面传参工具</text>
        </view>
        <view class="tool-arrow">></view>
      </view>
      
      <view class="tool-item" @click="testEnvironment">
        <view class="tool-icon">⚙️</view>
        <view class="tool-info">
          <text class="tool-name">环境配置测试</text>
          <text class="tool-desc">查看当前环境变量</text>
        </view>
        <view class="tool-arrow">></view>
      </view>
    </view>

    <view class="info-section">
      <view class="info-item">
        <text class="info-label">页面参数：</text>
        <text class="info-value">{{ pageParamsText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { getCurrentPageParams } from '@/utils/page.js';
import { config, isDev } from '@/utils/env.js';

const count = ref(0);
const pageParams = ref(getCurrentPageParams());

const pageParamsText = computed(() => {
  return pageParams.value ? JSON.stringify(pageParams.value) : '无参数';
});

function onClick() {
  count.value++;
}

function goToComponentTest() {
  uni.navigateTo({
    url: '/pages/tools/component-test/index'
  });
}

function testPageParams() {
  uni.showModal({
    title: '页面参数',
    content: `当前页面参数：${pageParamsText.value}`,
    showCancel: false
  });
}

function testEnvironment() {
  const envInfo = {
    isDev,
    apiUrl: config.API_BASE_URL,
    appName: config.APP_NAME,
    version: config.APP_VERSION
  };
  
  uni.showModal({
    title: '环境信息',
    content: JSON.stringify(envInfo, null, 2),
    showCancel: false
  });
}

onLoad(() => {
  console.log('Demo页面加载完成');
  console.log('pageParams...', pageParams.value);
});

onShow(() => {
  console.log('Demo页面显示');
});
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  background-color: #f2f2f2;
  padding: 20rpx;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40rpx 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  text-align: center;
  
  .title {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
  }
  
  .subtitle {
    display: block;
    font-size: 28rpx;
    opacity: 0.9;
  }
}

.demo-section {
  background: white;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .demo-item {
    padding: 30rpx;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border-radius: 8rpx;
    text-align: center;
    color: white;
    
    .demo-text {
      display: block;
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }
    
    .demo-desc {
      display: block;
      font-size: 24rpx;
      opacity: 0.9;
    }
  }
}

.tools-section {
  background: white;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    padding-bottom: 10rpx;
    border-bottom: 2rpx solid #eee;
  }
}

.tool-item {
  display: flex;
  align-items: center;
  padding: 25rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background-color: #f8f8f8;
  }
  
  .tool-icon {
    font-size: 48rpx;
    margin-right: 20rpx;
  }
  
  .tool-info {
    flex: 1;
    
    .tool-name {
      display: block;
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      margin-bottom: 5rpx;
    }
    
    .tool-desc {
      display: block;
      font-size: 24rpx;
      color: #666;
    }
  }
  
  .tool-arrow {
    font-size: 24rpx;
    color: #999;
  }
}

.info-section {
  background: white;
  border-radius: 12rpx;
  padding: 30rpx;
  
  .info-item {
    display: flex;
    margin-bottom: 15rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .info-label {
      font-size: 26rpx;
      color: #666;
      margin-right: 10rpx;
      min-width: 120rpx;
    }
    
    .info-value {
      font-size: 26rpx;
      color: #333;
      flex: 1;
      word-break: break-all;
    }
  }
}
</style>
