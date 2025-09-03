<template>
  <view class="work-persons-page">
    <!-- 服务团队 -->
    <view class="section" v-if="serviceTeam.length">
      <view class="section-title">服务团队</view>
      <view class="grid-container">
        <view class="service-card" v-for="item in serviceTeam" :key="item.id" :class="getServiceCardClass(item.role)">
          <view class="avatar-container">
            <image class="avatar" :src="item.avatar" mode="aspectFill" />
            <view class="phone-icon" @click="call(item.mobile)" v-if="item.mobile">
              <image class="phone-bg" :src="images.phoneGreenBg" mode="aspectFit" />
              <image class="phone-icon-img" :src="images.phone" mode="aspectFit" />
            </view>
          </view>
          <view class="info">
            <text class="name">{{ item.name }}</text>
            <text class="role">{{ item.role }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 施工团队 -->
    <view class="section" v-if="constructionTeam.length">
      <view class="section-title">施工团队</view>
      <view class="grid-container">
        <view class="construction-card" v-for="(item, index) in constructionTeam" :key="index">
          <view class="avatar-container">
            <image class="avatar" :src="item.avatar" mode="aspectFill" />
          </view>
          <view class="info">
            <text class="name">{{ item.name }}</text>
            <text class="role">{{ item.role }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import images from '@/utils/images';

// 响应式数据
const serviceTeam = ref([]);
const constructionTeam = ref([]);

// 从缓存获取页面参数
const getPageCache = () => {
  try {
    const params = uni.getStorageSync('team_params');
    return params || {};
  } catch (error) {
    console.error('获取缓存参数失败:', error);
    return {};
  }
};

// 页面加载
onLoad((options) => {
  const cacheParams = getPageCache();
  console.log('缓存参数:', cacheParams);
  
  // 模拟数据 - 实际开发中应根据projectId调用接口
  loadTeamData(cacheParams.projectId);
});

// 加载团队数据
const loadTeamData = (projectId) => {
  // 模拟服务团队数据
  serviceTeam.value = [
    {
      id: 1,
      name: '张经理',
      role: '项目经理',
      avatar: images.home.p1,
      mobile: '13888888888'
    },
    {
      id: 2,
      name: '李设计师',
      role: '主任设计师',
      avatar: images.home.p1,
      mobile: '13666666666'
    },
    {
      id: 3,
      name: '王监理',
      role: '工程监理',
      avatar: images.home.p1,
      mobile: '13999999999'
    }
  ];
  
  // 模拟施工团队数据
  constructionTeam.value = [
    {
      name: '陈师傅',
      role: '水电工',
      avatar: images.home.p1
    },
    {
      name: '刘师傅',
      role: '泥瓦工',
      avatar: images.home.p1
    }
  ];
};
// 获取服务团队卡片的样式类
const getServiceCardClass = (role) => {
  // 经理类角色使用蓝色渐变
  if (role.includes('经理')) {
    return 'manager-card';
  }
  // 设计师类角色使用橙色渐变
  if (role.includes('设计师')) {
    return 'designer-card';
  }
  return '';
};

// 拨打电话
const call = (phone) => {
  if (!phone) {
    uni.showToast({ title: '暂无电话', icon: 'none' });
    return;
  }
  uni.makePhoneCall({ phoneNumber: String(phone) });
};
</script>

<style>
page {
  background: #f2f2f2;
}
</style>

<style scoped lang="scss">
.work-persons-page {
  padding: 20rpx 30rpx;
}

.section {
  margin-bottom: 20rpx;
}

.section-title {
  font-family: Source Han Sans;
  font-size: 24rpx;
  font-weight: 500;
  line-height: 39rpx;
  color: #000000;
}

.grid-container {
  margin-top: 20rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18rpx;
}

// 服务团队卡片样式
.service-card {
  background: #fff;
  border-radius: 14rpx;
  padding: 40rpx 18rpx;
  text-align: center;
  position: relative;
  border: 2rpx solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 2rpx 6rpx 0 rgba(0, 0, 0, 0.1);

  &.manager-card {
    background: linear-gradient(180deg, #ffffff 25%, #d3e5ff 100%);
  }

  &.designer-card {
    background: linear-gradient(180deg, #ffffff 25%, #fff0df 100%);
  }
}

// 施工团队卡片样式
.construction-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx 16rpx;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.avatar-container {
  position: relative;
  display: inline-block;
  margin-bottom: 24rpx;
}

.avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
}

// 电话图标样式（仅服务团队有）
.phone-icon {
  position: absolute;
  bottom: 0rpx;
  right: 2rpx;
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.phone-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.phone-icon-img {
  width: 14rpx;
  height: 14rpx;
  z-index: 1;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
  line-height: 1.2;
}

.role {
  font-size: 24rpx;
  color: #666;
  line-height: 1.2;
}

// 响应式调整
@media (max-width: 750rpx) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 16rpx;
  }

  .service-card,
  .construction-card {
    padding: 20rpx 12rpx;
  }

  .avatar {
    width: 100rpx;
    height: 100rpx;
  }

  .phone-icon {
    width: 36rpx;
    height: 36rpx;
  }

  .phone-icon-img {
    width: 18rpx;
    height: 18rpx;
  }
}
</style>
