<template>
  <view class="home-banner">
    <image class="banner-image" :src="images.home.banner" mode="widthFix" />
  </view>
</template>

<script setup>
import images from '@/utils/images';
</script>

<style scoped lang="scss">
.home-banner {
  margin: 20rpx 0;
  border-radius: 20rpx;

  .banner-image {
    width: 100%;
    display: block;
  }
}
</style>
