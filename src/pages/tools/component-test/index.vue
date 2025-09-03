<template>
  <view class="component-test-page">
    <view class="page-header">
      <text class="page-title">组件测试页面</text>
      <text class="page-desc">测试 components 下的所有组件</text>
    </view>

    <!-- cpm-textarea 组件测试 -->
    <view class="test-section">
      <view class="section-title">1. cpm-textarea 组件测试</view>
      <view class="test-item">
        <view class="label">基础用法：</view>
        <cpm-textarea 
          v-model="textareaValue" 
          placeholder="请输入内容"
          :maxlength="200"
          :show-count="true"
        />
        <view class="result">当前值：{{ textareaValue }}</view>
      </view>
      
      <view class="test-item">
        <view class="label">禁用状态：</view>
        <cpm-textarea 
          v-model="disabledValue" 
          placeholder="禁用状态"
          :disabled="true"
        />
      </view>
    </view>

    <!-- cpm-file-upload 组件测试 -->
    <view class="test-section">
      <view class="section-title">2. cpm-file-upload 组件测试</view>
      <view class="test-item">
        <view class="label">图片上传：</view>
        <cpm-file-upload 
          v-model="imageFiles" 
          accept="image"
          :max-count="3"
          @change="onImageChange"
        />
        <view class="result">已选择 {{ imageFiles.length }} 个文件</view>
      </view>
      
      <view class="test-item">
        <view class="label">图片+视频上传：</view>
        <cpm-file-upload 
          v-model="mediaFiles" 
          accept="image,video"
          :max-count="5"
          @change="onMediaChange"
        />
        <view class="result">已选择 {{ mediaFiles.length }} 个文件</view>
      </view>
      
      <view class="test-item">
        <view class="label">禁用状态：</view>
        <cpm-file-upload 
          v-model="disabledFiles" 
          :disabled="true"
        />
      </view>
    </view>

    <!-- cpm-tabbar 组件测试 -->
    <view class="test-section">
      <view class="section-title">3. cpm-tabbar 组件测试</view>
      <view class="test-item">
        <view class="label">自定义 Tabbar（当前页面路径）：</view>
        <view class="tabbar-demo">
          <cpm-tabbar :path="currentPath" />
        </view>
      </view>
    </view>

    <!-- 测试结果显示 -->
    <view class="test-results">
      <view class="section-title">测试结果</view>
      <view class="result-item">
        <text class="result-label">文本框内容：</text>
        <text class="result-value">{{ textareaValue || '暂无' }}</text>
      </view>
      <view class="result-item">
        <text class="result-label">图片文件数量：</text>
        <text class="result-value">{{ imageFiles.length }}</text>
      </view>
      <view class="result-item">
        <text class="result-label">媒体文件数量：</text>
        <text class="result-value">{{ mediaFiles.length }}</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="actions">
      <button class="action-btn" @click="clearAll">清空所有数据</button>
      <button class="action-btn" @click="fillTestData">填充测试数据</button>
      <button class="action-btn" @click="showResults">显示结果</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 定义响应式数据
const textareaValue = ref('');
const disabledValue = ref('这是禁用状态的内容');
const imageFiles = ref([]);
const mediaFiles = ref([]);
const disabledFiles = ref([]);
const currentPath = ref('/pages/tools/component-test/index');

// 事件处理函数
const onImageChange = (files) => {
  console.log('图片文件变化:', files);
};

const onMediaChange = (files) => {
  console.log('媒体文件变化:', files);
};

const clearAll = () => {
  textareaValue.value = '';
  imageFiles.value = [];
  mediaFiles.value = [];
  uni.showToast({
    title: '已清空所有数据',
    icon: 'success'
  });
};

const fillTestData = () => {
  textareaValue.value = '这是测试文本内容，用于验证 cpm-textarea 组件的功能是否正常。';
  uni.showToast({
    title: '已填充测试数据',
    icon: 'success'
  });
};

const showResults = () => {
  const results = {
    textareaValue: textareaValue.value,
    imageFilesCount: imageFiles.value.length,
    mediaFilesCount: mediaFiles.value.length,
  };
  
  uni.showModal({
    title: '测试结果',
    content: JSON.stringify(results, null, 2),
    showCancel: false
  });
};

// 页面生命周期
import { onLoad, onShow } from '@dcloudio/uni-app';

onLoad(() => {
  console.log('组件测试页面加载完成');
});

onShow(() => {
  console.log('组件测试页面显示');
});
</script>

<style scoped lang="scss">
.component-test-page {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  text-align: center;
  
  .page-title {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
  }
  
  .page-desc {
    display: block;
    font-size: 28rpx;
    color: #666;
  }
}

.test-section {
  background: #fff;
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

.test-item {
  margin-bottom: 30rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .label {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 10rpx;
    display: block;
  }
  
  .result {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: #999;
    padding: 10rpx;
    background: #f8f8f8;
    border-radius: 6rpx;
  }
}

.tabbar-demo {
  position: relative;
  height: 100rpx;
  border: 2rpx dashed #ddd;
  border-radius: 8rpx;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: 'Tabbar 组件在这里显示';
    color: #999;
    font-size: 24rpx;
  }
}

.test-results {
  background: #fff;
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

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .result-label {
    font-size: 28rpx;
    color: #666;
  }
  
  .result-value {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
  }
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  
  .action-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8rpx;
    padding: 25rpx;
    font-size: 28rpx;
    font-weight: 500;
    
    &:active {
      opacity: 0.8;
    }
    
    &:nth-child(2) {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    &:nth-child(3) {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
  }
}

// 确保组件正常显示
:deep(.cpm-textarea) {
  margin-bottom: 10rpx;
}

:deep(.cpm-file-upload) {
  margin-bottom: 10rpx;
}
</style>
