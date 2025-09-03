<template>
  <view class="login-container">
    <!-- 顶部背景区域 -->
    <view class="login-header">
      <image class="login-header__background" :src="images.login.logoBg"></image>
    </view>

    <!-- 底部登录表单区域 -->
    <view class="login-form">
      <view class="form-container">
        <!-- 输入框 -->
        <view class="input-field">
          <image class="input-icon" :src="images.login.personIcon"></image>
          <input v-model="formData.username" class="input" placeholder="请输入账号" />
        </view>

        <view class="input-field">
          <image class="input-icon" :src="images.login.pwdIcon"></image>
          <input v-model="formData.password" class="input" type="password" placeholder="请输入密码" />
        </view>

        <!-- 按钮 -->
        <view class="button-group">
          <button class="btn btn-primary" @click="handleAccountLogin()">立即登录</button>
          <button class="btn btn-wechat" @click="handleWechatPhoneLogin" :open-type="agreementChecked ? 'getPhoneNumber' : ''" @getphonenumber="onGetPhoneNumber">
            <image class="btn-icon" :src="images.wechat" />
            手机号快捷登录
          </button>
        </view>
      </view>
    </view>

    <!-- 协议区域 -->
    <view class="agreement">
      <view class="agreement-item" @click="toggleAgreement">
        <image class="checkbox" :src="agreementChecked ? images.login.checkIcon2 : images.login.checkIcon1"></image>
        <text class="agreement-text">
          我已阅读并同意
          <text class="link" @click.stop="showUserAgreement">《用户协议》</text>
          和
          <text class="link" @click.stop="showPrivacyPolicy">《隐私政策》</text>
        </text>
      </view>
      <text class="notice">仅供内部人员使用</text>
    </view>

    <!-- 底部品牌 -->
    <view class="footer">
      <image class="brand-logo" :src="images.login.t1Bg"></image>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { login } from '../../store/index.js';
import { authAPI } from '@/api/auth.js';
import { tokenManager } from '@/auth/tokenManager.js';
import CryptoJS from 'crypto-js';
import images from '@/utils/images';

// 状态
const formData = reactive({
  username: '',
  password: '',
});
const agreementChecked = ref(false);
const loading = ref(false);

// 微信登录按钮点击
const handleWechatPhoneLogin = () => {
  if (!agreementChecked.value) {
    uni.showToast({
      title: '请阅读用户协议和隐私政策，并确认勾选',
      icon: 'none',
    });
    return false;
  }
  return true;
};

// 微信授权回调
const onGetPhoneNumber = async (e) => {
  if (e.detail.errMsg === 'getPhoneNumber:ok') {
    await handlePhoneLogin(e.detail);
  } else {
    uni.showToast({
      title: '需要授权手机号',
      icon: 'none',
    });
  }
};

// 手机号登录
const handlePhoneLogin = async (phoneData) => {
  loading.value = true;
  try {
    // 实际项目中调用: await authAPI.phoneLogin(phoneData)
    // 模拟登录
    const result = {
      code: 0,
      data: {
        token: 'wechat_token_' + Date.now(),
        userId: 'wechat_user_' + Date.now(),
        username: '138****8000',
      },
    };

    if (result.code === 0) {
      loginSuccess(result.data);
    }
  } catch (error) {
    handleLoginError(error);
  } finally {
    loading.value = false;
  }
};

// 账号密码登录
const handleAccountLogin = async () => {
  if (!formData.username.trim()) {
    uni.showToast({ title: '请输入账号', icon: 'none' });
    return;
  }
  if (!formData.password.trim()) {
    uni.showToast({ title: '请输入密码', icon: 'none' });
    return;
  }
  if (!agreementChecked.value) {
    uni.showToast({ title: '请阅读用户协议和隐私政策，并确认勾选', icon: 'none' });
    return;
  }

  loading.value = true;
  try {
    const result = await authAPI.login({
      username: formData.username,
      password: CryptoJS.MD5(formData.password).toString(),
    });

    if (result?.code === 0) {
      loginSuccess(result.data);
    }
  } catch (error) {
    handleLoginError(error);
  } finally {
    loading.value = false;
  }
};

// 登录成功
const loginSuccess = (userData) => {
  tokenManager.saveToken(userData);
  login(userData.userId);
  uni.switchTab({ url: '/pages/index/index' });
  uni.showToast({ title: '登录成功', icon: 'success' });
};

// 登录失败
const handleLoginError = (error) => {
  console.error('登录失败:', error);
  let message = '登录失败，请重试';

  if (error.code === 401) message = '用户名或密码错误';
  else if (error.code === 403) message = '账号被禁用';
  else if (error.message) message = error.message;

  uni.showModal({
    title: '登录失败',
    content: message,
    showCancel: false,
  });
};

// 工具方法
const toggleAgreement = () => {
  agreementChecked.value = !agreementChecked.value;
};

const showUserAgreement = () => {
  uni.navigateTo({ url: '/pages/legal/user-agreement/index' });
};

const showPrivacyPolicy = () => {
  uni.navigateTo({ url: '/pages/legal/privacy/index' });
};
</script>

<style scoped lang="scss">
// 登录页面容器
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

// 头部区域
.login-header {
  width: 100%;
  position: relative;

  &__background {
    width: 100%;
    height: 510rpx;
  }
}

// 登录表单区域
.login-form {
  width: 100%;
  margin-top: 50rpx;

  .form-container {
    margin: 0 115rpx;

    .input-field {
      border-radius: 8rpx;
      padding: 15rpx;
      margin-bottom: 50rpx;
      display: flex;
      align-items: center;
      border: 1rpx solid rgba(22, 119, 255, 0.4);

      .input-icon {
        width: 30rpx;
        height: 30rpx;
        margin-right: 16rpx;
      }

      .input {
        flex: 1;
        font-size: 28rpx;
        color: #333;
        background: transparent;
        border: none;
      }
    }

    .button-group {
      margin-top: 38px;
      margin-bottom: 40rpx;
      display: flex;
      flex-direction: column;
      gap: 20rpx;

      .btn {
        line-height: 66rpx;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8rpx;
        border: none;
        font-size: 26rpx;

        &-primary {
          background: #1677ff;
          color: #fff;

          &:disabled {
            background: #ccc;
            color: #999;
          }
        }

        &-wechat {
          background: #fff;
          color: #1677ff;
          border: 1px solid #1677ff;

          .btn-icon {
            width: 32rpx;
            height: 32rpx;
            margin-right: 15rpx;
          }
        }
      }
    }
  }
}

// 协议区域
.agreement {
  margin-top: 87rpx;
  text-align: center;

  .agreement-item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16rpx;

    .checkbox {
      width: 24rpx;
      height: 24rpx;
    }

    .agreement-text {
      margin-left: 10rpx;
      font-size: 20rpx;
      color: #979797;

      .link {
        color: #1677ff;
      }
    }
  }

  .notice {
    font-size: 20rpx;
    color: #999;
  }
}

// 底部品牌
.footer {
  position: absolute;
  bottom: 65rpx;
  text-align: center;

  .brand-logo {
    width: 200rpx;
    height: 80rpx;
  }
}
</style>
