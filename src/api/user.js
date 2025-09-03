import http from './core/request.js';

/**
 * 用户相关API
 */
export const userApi = {
  /**
   * 获取用户信息
   * @param {Object} params 请求参数
   * @returns {Promise}
   */
  getUserInfo: (params = {}) => {
    return http.get('/app-api/user/profile', params);
  },

  /**
   * 更新用户信息
   * @param {Object} data 用户数据
   * @returns {Promise}
   */
  updateUserInfo: (data) => {
    return http.post('/app-api/user/update', data);
  },

  /**
   * 修改密码
   * @param {Object} data 密码数据
   * @returns {Promise}
   */
  changePassword: (data) => {
    return http.post('/app-api/user/change-password', data);
  },

  /**
   * 上传头像
   * @param {string} filePath 文件路径
   * @returns {Promise}
   */
  uploadAvatar: (filePath) => {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: '/app-api/user/upload-avatar',
        filePath,
        name: 'avatar',
        header: {
          Authorization: `Bearer ${uni.getStorageSync('token')}`,
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data);
            if (data.code === 0) {
              resolve(data);
            } else {
              reject(data);
            }
          } catch (e) {
            reject({ message: '上传失败' });
          }
        },
        fail: (error) => {
          reject({ message: '上传失败', error });
        },
      });
    });
  },
};

export default userApi;
