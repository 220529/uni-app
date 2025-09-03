<template>
  <view class="home-content">
    <!-- Banner图 -->
    <home-banner v-if="userStatus !== 'unlogged'" />

    <view class="p1" v-if="showP1">
      <!-- 清新家居流程 -->
      <home-process />

      <!-- 需求流程滑块 -->
      <home-process-slider />

      <!-- 施工进度 -->
      <!-- <home-construction-progress v-if="shouldShowConstructionProgress" /> -->

      <!-- 项目播报列表 -->
      <!-- <home-broadcast-list v-if="shouldShowProjectBroadcast" mode="component" /> -->
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';

// Props
const props = defineProps({
  // 用户状态
  userStatus: {
    type: String,
    required: true,
    validator: (value) => ['unlogged', 'signed', 'construction_start', 'construction', 'completed'].includes(value),
  },
});

const showP1 = computed(() => {
  return ['unlogged', 'signed', 'completed'].includes(props.userStatus);
});

// 根据用户状态计算显示的内容区块
const shouldShowFreshHomeProcess = computed(() => {
  // 未登录、已签约、竣工状态显示清新家居流程
  return ['unlogged', 'signed', 'completed'].includes(props.userStatus);
});

const shouldShowDemandSlider = computed(() => {
  // 与清新家居流程同步显示需求滑块
  return ['unlogged', 'signed', 'completed'].includes(props.userStatus);
});

const shouldShowConstructionProgress = computed(() => {
  // 开工交底状态显示施工进度
  return props.userStatus === 'construction_start';
});

const shouldShowProjectBroadcast = computed(() => {
  // 施工阶段显示项目播报
  return props.userStatus === 'construction';
});
</script>

<style scoped lang="scss">
.home-content {
  margin: 0 20rpx 50rpx;
  .p1 {
    border-radius: 20rpx;
    padding: 27rpx 0 34rpx;
    background: linear-gradient(180deg, #FFFFFF 0%, #DFF7F7 100%);
  }
}
</style>
