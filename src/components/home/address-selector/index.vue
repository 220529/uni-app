<template>
  <view class="address-selector">
    <view class="address-text">{{ currentAddress }}</view>
    <view class="refresh-icon-container" @click="handleSelect">
      <image class="refresh-icon" :src="images.home.refreash" />
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import images from '@/utils/images';
import { eventBus } from '@/utils/eventBus';

// 当前地址
const currentAddress = ref('天云华润优雅湾景艺语');

// Mock项目数据
const mockProjectData = {
  天云华润优雅湾景艺语: {
    startDate: '2025-06-25',
    contractorName: '王玉海',
    contractorPhone: '13812345678',
  },
  碧桂园凤凰城: {
    startDate: '2025-06-20',
    contractorName: '李师傅',
    contractorPhone: '13987654321',
  },
  万科金色家园: {
    startDate: '2025-06-15',
    contractorName: '张工长',
    contractorPhone: '13765432198',
  },
};

// 选择地址
const handleSelect = () => {
  uni.showActionSheet({
    itemList: ['天云华润优雅湾景艺语', '碧桂园凤凰城', '万科金色家园'],
    success: (res) => {
      const addresses = ['天云华润优雅湾景艺语', '碧桂园凤凰城', '万科金色家园'];
      const newAddress = addresses[res.tapIndex];
      const projectData = mockProjectData[newAddress];

      currentAddress.value = newAddress;

      // 保存到缓存
      uni.setStorageSync('current_address', newAddress);
      uni.setStorageSync('project_data', projectData);

      // 通知home页面更新数据
      eventBus.emit('ADDRESS_CHANGED', {
        address: newAddress,
        projectData,
      });
    },
  });
};

// 组件加载时初始化数据
onMounted(() => {
  const cachedAddress = uni.getStorageSync('current_address');
  if (cachedAddress) {
    currentAddress.value = cachedAddress;
  }
});
</script>

<style scoped lang="scss">
.address-selector {
  margin-top: 30rpx;
  display: flex;
  align-items: center;
  border-radius: 6rpx;

  .address-text {
    width: 288rpx;
    padding: 0 12rpx;
    box-sizing: border-box;
    background: #f7fdfd;
    
    /* 文本溢出显示省略号 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-family: Source Han Sans;
    font-size: 26rpx;
    font-weight: normal;
    color: #2aa3a3;
  }

  .refresh-icon-container {
    border-radius: 0px 6px 6px 0px;
    background: #2aa3a3;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42rpx;
    height: 42rpx;
    .refresh-icon {
      width: 20rpx;
      height: 20rpx;
    }
  }
}
</style>
