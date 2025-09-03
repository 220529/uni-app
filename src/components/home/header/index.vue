<template>
  <view class="home-header" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <!-- 状态提示语 - 根据状态渲染不同结构 -->

    <!-- 未登录状态 -->
    <view class="status-message status-unlogged" v-if="userStatus === 'unlogged'">
      <text class="unlogged-title">为你倾心定制理想家园</text>
      <image class="unlogged-subtitle" :src="images.home.t2" />
      <image class="unlogged-subtitle2" :src="images.home.t3" />
    </view>

    <!-- 已签约状态 -->
    <view class="status-message status-signed" v-else-if="userStatus === 'signed'">
      <text class="signed-title">新家开工在即，</text>
      <text class="signed-subtitle">我们就绪，静候启幕！</text>
    </view>

    <!-- 开工交底/施工中状态 -->
    <view class="status-message status-construction" v-else-if="userStatus === 'construction_start' || userStatus === 'construction'">
      <text class="construction-greeting">{{ greetingText }}</text>
      <view class="construction-days">
        <text class="days-text">新家已开工第 </text>
        <text class="days-number">{{ constructionDaysText }}</text>
        <text class="days-text"> 天</text>
      </view>
    </view>

    <!-- 竣工状态 -->
    <view class="status-message status-completed" v-else-if="userStatus === 'completed'">
      <text class="completed-greeting">{{ greetingText }}</text>
      <text class="completed-subtitle">您的新家已竣工！</text>
    </view>

    <view class="operation" v-if="userStatus !== 'unlogged'">
      <!-- 地址选择器 -->
      <home-address-selector />

      <!-- 菜单滚动栏 -->
      <home-menu-scrollbar />
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import images from '@/utils/images';

// Props - 用户状态和项目数据
const props = defineProps({
  userStatus: {
    type: String,
    required: true,
    validator: (value) => ['unlogged', 'signed', 'construction_start', 'construction', 'completed'].includes(value),
  },
  projectData: {
    type: Object,
    default: () => ({
      address: '',
      startDate: null,
      constructionDays: 0,
      contractorName: '',
      contractorPhone: '',
    }),
  },
});
console.log(props.userStatus);

// 计算背景图
const backgroundImage = computed(() => {
  // 根据状态可以返回不同背景图，目前都使用h1
  return images.home.h1;
});

// 计算实际开工天数
const constructionDays = computed(() => {
  if (!props.projectData.startDate) return 0;

  const startDate = new Date(props.projectData.startDate);
  const today = new Date();
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
});

// 获取当前时间段的问候语
const greetingText = computed(() => {
  const hour = new Date().getHours();
  if (hour < 6) return '凌晨好';
  if (hour < 9) return '早上好';
  if (hour < 12) return '上午好';
  if (hour < 14) return '中午好';
  if (hour < 17) return '下午好';
  if (hour < 19) return '傍晚好';
  return '晚上好';
});

// 格式化天数显示
const constructionDaysText = computed(() => {
  return constructionDays.value.toString().padStart(2, '0');
});

// 计算是否显示banner
const showBanner = computed(() => {
  return props.userStatus !== 'unlogged';
});
</script>

<style scoped lang="scss">
.home-header {
  width: 100%;
  min-height: 640rpx;
  box-sizing: border-box;
  background-size: cover;
  background-position: center;
  position: relative;
  padding-top: 210rpx;

  .status-message {
    text-align: center;
    margin-left: 45rpx;
  }

  // 未登录状态样式
  .status-unlogged {
    margin-left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    .unlogged-title {
      font-family: Source Han Sans;
      font-size: 52rpx;
      font-weight: normal;
      color: #2aa3a3;
    }

    .unlogged-subtitle {
      margin-top: 8rpx;
      width: 637rpx;
      height: 60rpx;
    }

    .unlogged-subtitle2 {
      margin-top: 30rpx;
      width: 468rpx;
      height: 60rpx;
    }
  }

  // 已签约状态样式
  .status-signed {
    display: flex;
    flex-direction: column;
    .signed-title {
      font-family: Source Han Sans;
      font-size: 52rpx;
      font-weight: 500;
      color: #333333;
      text-align: left;
    }

    .signed-subtitle {
      font-family: Source Han Sans;
      font-size: 52rpx;
      font-weight: 500;
      color: #333333;
      text-align: left;
    }
  }

  // 施工中状态样式
  .status-construction {
    .construction-greeting {
      display: block;
      color: white;
      font-size: 40rpx;
      font-weight: 600;
      line-height: 1.2;
      margin-bottom: 20rpx;
    }

    .construction-days {
      display: flex;
      align-items: center;
      justify-content: center;

      .days-text {
        color: rgba(255, 255, 255, 0.9);
        font-size: 28rpx;
        font-weight: 400;
      }

      .days-number {
        color: #52c41a; // 绿色高亮天数
        font-size: 32rpx;
        font-weight: 700;
        margin: 0 4rpx;
      }
    }
  }

  // 竣工状态样式
  .status-completed {
    .completed-greeting {
      display: block;
      color: white;
      font-size: 40rpx;
      font-weight: 600;
      line-height: 1.2;
      margin-bottom: 20rpx;
    }

    .completed-subtitle {
      display: block;
      color: rgba(255, 255, 255, 0.9);
      font-size: 28rpx;
      font-weight: 400;
      line-height: 1.4;
    }
  }
  .operation {
    margin-left: 45rpx;
  }
}
</style>
