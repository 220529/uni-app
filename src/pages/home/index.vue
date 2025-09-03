<template>
  <view class="home-page">
    <!-- 头部组件 -->
    <home-header :user-status="userStatus" :project-data="projectData" />
    
    <!-- 内容组件 -->
    <home-content :user-status="userStatus" />
    
    <!-- 自定义tabbar -->
    <cpm-tabbar :path="currentPath" />
  </view>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { eventBus, EVENT_NAMES } from '@/utils/eventBus';

// 当前页面路径
const currentPath = '/pages/home/index';

// 用户状态 - 可以从store或接口获取，默认为未登录状态
const userStatus = ref('unlogged'); // 'unlogged' | 'signed' | 'construction_start' | 'construction' | 'completed'

// 🔧 开发调试配置 - 手动控制用户状态，方便测试不同UI
// 使用方法：
// 1. 设置 IS_DEBUG_MODE = true
// 2. 修改 DEBUG_USER_STATUS 为想要测试的状态
// 3. 保存后查看效果
// 4. 生产环境请设置 IS_DEBUG_MODE = false
const IS_DEBUG_MODE = true; // 开发时设为true，生产时设为false
const DEBUG_USER_STATUS = 'signed'; // 手动指定状态: 'unlogged' | 'signed' | 'construction_start' | 'construction' | 'completed'

// 项目数据 - 用于在子组件间共享
const projectData = ref({
  address: '天云华润优雅湾景艺语',
  startDate: '2025-06-25',
  constructionDays: 0,
  contractorName: '王玉海',
  contractorPhone: '13812345678'
});

// 初始化用户状态
const initializeUserStatus = () => {
  // 🔧 调试模式：使用手动指定的状态
  if (IS_DEBUG_MODE) {
    userStatus.value = DEBUG_USER_STATUS;
    console.log(`🔧 调试模式已启用，当前状态: ${DEBUG_USER_STATUS}`);
    return;
  }
  
  // 这里可以调用接口获取用户真实状态
  // 暂时使用模拟数据，可以根据地址或其他条件设置不同状态
  
  // 从缓存读取项目数据
  const cachedProjectData = uni.getStorageSync('project_data');
  if (cachedProjectData) {
    projectData.value = { ...projectData.value, ...cachedProjectData };
  }
  
  // 实际业务逻辑：根据用户登录状态和项目数据判断用户状态
  const hasUserToken = uni.getStorageSync('token') || uni.getStorageSync('user_info'); // 检查是否已登录
  
  if (!hasUserToken) {
    userStatus.value = 'unlogged'; // 未登录状态
    return;
  }
  
  // 已登录，根据项目数据判断具体状态
  if (!projectData.value.startDate) {
    userStatus.value = 'signed'; // 已签约但未开工
    return;
  }
  
  // 根据开工日期判断施工阶段
  const projectStartDate = new Date(projectData.value.startDate);
  const currentDate = new Date();
  const constructionDaysElapsed = Math.ceil((currentDate.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (constructionDaysElapsed < 0) {
    userStatus.value = 'signed'; // 还未到开工日期
  } else if (constructionDaysElapsed <= 60) {
    userStatus.value = 'construction'; // 施工进行中
  } else {
    userStatus.value = 'completed'; // 施工已完成
  }
  
  console.log(`📊 用户状态计算完成: ${userStatus.value}, 施工天数: ${Math.max(0, constructionDaysElapsed)}`);
};

// 处理地址变更事件
const handleAddressChange = (addressChangeData) => {
  projectData.value = {
    address: addressChangeData.address,
    ...addressChangeData.projectData
  };
  
  // 重新初始化用户状态
  initializeUserStatus();
  
  console.log('地址已变更：', addressChangeData);
};

// 生命周期钩子
onLoad(() => {
  initializeUserStatus();
  
  // 监听地址变更事件
  eventBus.on(EVENT_NAMES.ADDRESS_CHANGED, handleAddressChange);
});

onUnmounted(() => {
  // 清理事件监听
  eventBus.off(EVENT_NAMES.ADDRESS_CHANGED, handleAddressChange);
});
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  background: #f7f7f7;
}
</style>
