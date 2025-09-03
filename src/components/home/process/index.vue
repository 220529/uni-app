<template>
  <view class="process-header">
    <view class="category-title">清新家居流程</view>
    <view class="main-title">
      <image class="decorative-star decorative-star-left" :src="images.home.star1" />
      <text>12步筑造理想家</text>
      <image class="decorative-star decorative-star-right" :src="images.home.star2" />
    </view>
    <view class="description">我们将装修过程简化为12个清晰步驱，每个环节都融入自然与舒话理念，让家成为放松身心的港湾</view>
  </view>
</template>

<script setup>
import images from '@/utils/images';
</script>

<style scoped lang="scss">
.process-header {
  display: flex;
  flex-direction: column;
  align-items: center;

  .category-title {
    font-family: Source Han Sans;
    font-size: 30rpx;
    font-weight: normal;
    line-height: 60rpx;
    color: #2aa3a3;
  }

  .main-title {
    display: inline-block;
    font-family: Source Han Sans;
    font-size: 42rpx;
    font-weight: bold;
    line-height: 60rpx;
    color: #333333;
    position: relative;

    .decorative-star {
      position: absolute;
      top: 0;
      width: 40rpx;
      height: 40rpx;

      &-left {
        left: -40rpx;
      }

      &-right {
        right: -40rpx;
      }
    }
  }

  .description {
    width: 617rpx;
    text-align: center;
    margin-top: 12rpx;
    font-family: Source Han Sans;
    font-size: 24rpx;
    font-weight: normal;
    line-height: 36rpx;
    color: #808080;
  }
}
</style>
