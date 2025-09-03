<template>
  <view class="cpm-file-upload">
    <view class="file-list-grid">
      <view v-for="(file, index) in fileListWithUpload" :key="file.id || index" class="file-grid-item" @click="file.isUpload ? chooseFile() : previewMedia(index)">
        <!-- 上传按钮 -->
        <template v-if="file.isUpload">
          <view class="upload-placeholder">
            <image :src="images.upload" class="upload" mode="widthFix"></image>
          </view>
        </template>

        <!-- 文件显示 -->
        <template v-else>
          <!-- 图片显示 -->
          <image v-if="file.type === 'image'" :src="file.url" mode="aspectFill" class="media-thumb" />

          <!-- 视频显示 -->
          <view v-else class="media-thumb video-thumb">
            <video
              :src="file.url"
              class="media-thumb video-grid-thumb"
              :controls="false"
              :muted="true"
              :show-center-play-btn="false"
              :show-fullscreen-btn="false"
              :show-play-btn="false"
              :show-progress="false"
              :show-mute-btn="false"
              :object-fit="'cover'"
            ></video>
            <view class="video-mask"></view>
            <view class="video-icon">
              <image :src="images.pause" class="icon" />
            </view>
          </view>

          <!-- 删除按钮 -->
          <view v-if="!props.disabled" class="delete-btn" @click.stop="deleteFile(index)">
            <image :src="images.redWarpper" class="delete-bg" />
            <image :src="images.close" class="delete-icon" />
          </view>
        </template>
      </view>
    </view>

    <!-- 视频预览弹窗 -->
    <view v-if="showVideoModal" class="video-modal-mask" @click="closeVideoModal">
      <video :src="currentVideoUrl" controls autoplay class="video-modal-player" @click.stop></video>
    </view>
  </view>
</template>

<script setup>
import images from '@/utils/images';
import { uploadApi } from '@/api/upload.js';

// Props定义
const props = defineProps({
  placeholder: { type: String, default: '点击上传' },
  modelValue: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
  maxCount: { type: Number, default: 10 },
  maxSize: { type: Number, default: 100 * 1024 * 1024 }, // 100MB
  accept: { type: String, default: 'image,video' },
  uploadUrl: { type: String, default: '/admin-api/infra/file/upload' },
  sizeType: { type: Array, default: () => ['original', 'compressed'] },
  sourceType: { type: Array, default: () => ['camera'] },
});

// Events定义
const emit = defineEmits(['update:modelValue', 'change']);

// 数据
const fileList = ref([]);

// 计算属性
const fileListWithUpload = computed(() => {
  if (!props.disabled && fileList.value.length < props.maxCount) {
    return [...fileList.value, { isUpload: true }];
  }
  return [...fileList.value];
});

// 视频预览
const showVideoModal = ref(false);
const currentVideoUrl = ref('');

// 监听外部传入的文件列表
watch(
  () => props.modelValue,
  (newVal) => {
    // 简单的浅比较避免循环更新
    const newUrls = newVal.map((f) => f.url || f).join(',');
    const currentUrls = fileList.value.map((f) => f.url).join(',');

    if (newUrls !== currentUrls) {
      fileList.value = [...newVal];
    }
  },
  { immediate: true, deep: true }
);

// 监听内部文件列表变化
watch(
  fileList,
  (newVal) => {
    emit('update:modelValue', [...newVal]);
    emit('change', [...newVal]);
  },
  { deep: true }
);

// 选择文件
const chooseFile = () => {
  if (props.disabled) return;
  if (fileList.value.length >= props.maxCount) {
    uni.showToast({
      title: `最多只能上传${props.maxCount}个文件`,
      icon: 'none',
    });
    return;
  }

  uni.chooseMedia({
    count: props.maxCount - fileList.value.length,
    mediaType: props.accept === 'image' ? ['image'] : props.accept === 'video' ? ['video'] : ['image', 'video'],
    sourceType: props.sourceType,
    sizeType: props.sizeType,
    success: (res) => {
      const files = res.tempFiles.map((file) => ({
        url: file.tempFilePath,
        name: file.tempFilePath.split('/').pop(),
        size: file.size,
        type: file.fileType,
        poster: file.thumbTempFilePath || '',
      }));

      // 检查文件大小限制
      const oversizedFiles = files.filter((file) => file.size > props.maxSize);
      if (oversizedFiles.length > 0) {
        const maxSizeMB = Math.round(props.maxSize / (1024 * 1024));
        uni.showToast({
          title: `部分文件超过${maxSizeMB}MB限制`,
          icon: 'none',
          duration: 3000,
        });
        return;
      }

      // 处理每个文件（使用新的API）
      files.forEach((file) => {
        afterRead(file);
      });
    },
    fail: (err) => {
      console.error('选择文件失败:', err);
    },
  });
};

// 上传文件
const afterRead = async (file) => {
  try {
    // 使用新的uploadApi，自动获得loading和错误处理
    const result = await uploadApi.uploadFile(file.url, {
      url: props.uploadUrl,
      loadingText: '上传中...',
      timeout: 15000,
    });

    // 上传成功，添加到文件列表
    fileList.value.push({
      ...file,
      url: result.data, // 使用API返回的标准数据结构
    });
  } catch (error) {
    console.error('文件上传失败:', error);
    // 错误提示已在API层处理
  }
};

// 删除文件
const deleteFile = (index) => {
  if (props.disabled) return;
  if (index >= 0 && index < fileList.value.length) {
    fileList.value.splice(index, 1);
  }
};

// 预览媒体
const previewMedia = (index) => {
  const file = fileList.value[index];
  if (file.type === 'image') {
    uni.previewImage({
      current: file.url,
      urls: fileList.value.filter((f) => f.type === 'image').map((f) => f.url),
    });
  } else if (file.type === 'video') {
    currentVideoUrl.value = file.url;
    showVideoModal.value = true;
  }
};

const closeVideoModal = () => {
  showVideoModal.value = false;
  currentVideoUrl.value = '';
};
</script>

<style lang="scss" scoped>
.cpm-file-upload {
  .file-list-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30rpx;
    margin-bottom: 20rpx;
  }

  .file-grid-item {
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 10rpx;
    position: relative;
  }

  .media-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 10rpx;
  }

  .video-thumb {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 10rpx;
    overflow: hidden;
  }

  .video-grid-thumb {
    background: #000;
  }

  .video-mask {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10rpx;
    z-index: 1;
  }

  .video-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    pointer-events: none;

    .icon {
      width: 48rpx;
      height: 48rpx;
    }
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 144rpx;
    height: 144rpx;
    background: #ffffff;
    border-radius: 10rpx;
    border: 1.5rpx solid rgba(193, 193, 193, 0.5);

    .upload {
      width: 42rpx;
      height: 42rpx;
    }
  }

  .delete-btn {
    position: absolute;
    top: -10rpx;
    right: -10rpx;
    width: 36rpx;
    height: 36rpx;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;

    .delete-bg {
      position: absolute;
      width: 36rpx;
      height: 36rpx;
    }

    .delete-icon {
      position: absolute;
      width: 16rpx;
      height: 16rpx;
    }
  }

  .video-modal-mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;

    .video-modal-player {
      width: 90vw;
      max-width: 600rpx;
      border-radius: 12rpx;
      background: #000;
      box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
