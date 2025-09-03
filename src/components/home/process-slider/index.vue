<template>
  <view class="demand-process-slider">
    <scroll-view class="scroll-container" scroll-x show-scrollbar="false">
      <image 
        class="large-process-image"
        :src="processLargeImage"
        mode="widthFix"
      />
    </scroll-view>
  </view>
</template>

<script setup>
import images from '@/utils/images';

// 大尺寸流程图片 - 尺寸为1340rpx*760rpx，需要横向滚动查看
const processLargeImage = images.home.t1; // 临时使用t1占位，实际应为大尺寸流程图
</script>

<style scoped lang="scss">
.demand-process-slider {
  margin-top: 40rpx;
  
  .scroll-container {
    width: 100%;
    padding: 20rpx 0;
    box-sizing: border-box;
    
    .large-process-image {
      padding: 0 20rpx;
      display: inline-block;
      width: 1340rpx; // 图片原始宽度
      height: 760rpx; // 图片原始高度
    }
  }
}
</style>
