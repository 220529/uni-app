<template>
  <view class="textarea-wrapper">
    <textarea :value="modelValue" @input="handleInput" :placeholder="placeholder" :maxlength="maxlength" :disabled="disabled" :auto-height="autoHeight" class="custom-textarea"></textarea>
    <view v-if="showCount" class="char-count"> {{ currentLength }}/{{ maxlength }} </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';

// 定义 props
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请输入',
  },
  maxlength: {
    type: Number,
    default: 500,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  autoHeight: {
    type: Boolean,
    default: true,
  },
  showCount: {
    type: Boolean,
    default: true,
  },
});

// 定义 emits
const emit = defineEmits(['update:modelValue']);

// 计算当前字符长度
const currentLength = computed(() => {
  return props.modelValue ? props.modelValue.length : 0;
});

// 处理输入事件
const handleInput = (e) => {
  emit('update:modelValue', e.detail.value);
};
</script>

<style scoped lang="scss">
.textarea-wrapper {
  position: relative;

  .custom-textarea {
    width: 100%;
    min-height: 140rpx; /* 相当于约3行文本的高度，匹配u-textarea默认高度 */
    padding: 20rpx;
    border: 1rpx solid #e4e7ed;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #333;
    background-color: #fff;
    box-sizing: border-box;

    &:focus {
      border-color: #409eff;
    }

    &:disabled {
      background-color: #f5f7fa;
      color: #c0c4cc;
    }
  }

  .char-count {
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
    font-size: 24rpx;
    color: #909399;
  }
}
</style>
