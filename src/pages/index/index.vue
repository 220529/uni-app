<template>
  <view class="page">
    <!-- 头部区域 -->
    <view class="header">
      <view class="slogan">为你匠心定制理想家园</view>
      <view class="subtitle">天｜云｜华｜润｜优｜雅｜湾｜景｜艺｜语</view>
      
      <!-- 功能按钮区域 -->
      <view class="function-buttons">
        <view class="btn-item">免费看房</view>
        <view class="btn-item">免费设计</view>
        <view class="btn-item">免费咨询</view>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <view class="content">
      <!-- 室内展示图 -->
      <view class="room-display">
        <image class="room-image" src="/static/logo.png" mode="aspectFit"></image>
      </view>

      <!-- 装修流程标题 -->
      <view class="process-title">
        <view class="title-text">清新家居流程</view>
        <view class="title-highlight">★ 12步筑造理想家 ★</view>
        <view class="title-desc">我们坚信每一个住区注定为爱而生，都蕴含着美好生活的力量，让生活在社区，享美化在于此。</view>
      </view>

      <!-- 流程步骤网格 -->
      <view class="process-grid">
        <view class="grid-item" v-for="(item, index) in processSteps" :key="index">
          <view class="step-number">{{ item.step }}</view>
          <view class="step-title">{{ item.title }}</view>
          <view class="step-desc">{{ item.desc }}</view>
        </view>
      </view>
    </view>
    
    <!-- 自定义tabbar -->
    <cpm-tabbar :path="currentPath" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentPath: '/pages/index/index',
      processSteps: [
        {
          step: '1',
          title: '咨询需求',
          desc: '倾听客户需求和预期以及客户生活习惯，掌握具体装修要求'
        },
        {
          step: '2', 
          title: '现场甲醛',
          desc: '专业规划施政、环保材料、实际设计以可制定完整方案'
        },
        {
          step: '3',
          title: '报价获约',
          desc: '实地设计、计算使用量、业务规范费用、确保各环节和大关'
        },
        {
          step: '4',
          title: '验证材料',
          desc: '标准成对行效果图实验装潢工厂成实现，开期方面实现即制对化'
        },
        {
          step: '5',
          title: '中期验收',
          desc: '立意结构工程，水电导解就绪，确认规范整体效率和制'
        },
        {
          step: '6',
          title: '末期安装',
          desc: '支持主体材料，主体圈绕法主、室贯时与多好宜居舒适'
        }
      ]
    }
  },
  
  onLoad() {
    
  },
  
  methods: {
    
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fb 0%, #ffffff 100%);
  /* tabbar占位空间现在由组件内部处理 */
}

.header {
  padding: 60rpx 40rpx 40rpx;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
}

.slogan {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  letter-spacing: 2rpx;
}

.subtitle {
  font-size: 28rpx;
  opacity: 0.9;
  margin-bottom: 60rpx;
  letter-spacing: 8rpx;
}

.function-buttons {
  display: flex;
  justify-content: center;
  gap: 30rpx;
}

.btn-item {
  background: rgba(255, 255, 255, 0.2);
  padding: 20rpx 40rpx;
  border-radius: 50rpx;
  font-size: 28rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.content {
  padding: 40rpx;
}

.room-display {
  text-align: center;
  margin-bottom: 60rpx;
}

.room-image {
  width: 100%;
  height: 400rpx;
  border-radius: 20rpx;
  background: #f5f5f5;
}

.process-title {
  text-align: center;
  margin-bottom: 60rpx;
}

.title-text {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.title-highlight {
  font-size: 40rpx;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 20rpx;
  letter-spacing: 2rpx;
}

.title-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  padding: 0 20rpx;
}

.process-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30rpx;
}

.grid-item {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  padding: 40rpx 30rpx;
  border-radius: 20rpx;
  text-align: center;
  color: white;
  box-shadow: 0 8rpx 25rpx rgba(132, 250, 176, 0.3);
}

.step-number {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
}

.step-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
}

.step-desc {
  font-size: 24rpx;
  line-height: 1.4;
  opacity: 0.9;
}
</style>
