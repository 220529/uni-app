import http from './core/request.js';
import { requestInterceptor } from './core/interceptors.js';

// loading 计数器（复用request.js的逻辑）
let loadingCount = 0;
const showLoading = (title = '上传中...') => {
  if (loadingCount === 0) {
    uni.showLoading({ title, mask: true });
  }
  loadingCount++;
};
const hideLoading = () => {
  loadingCount = Math.max(loadingCount - 1, 0);
  if (loadingCount === 0) {
    uni.hideLoading();
  }
};

// 错误提示节流（复用request.js的逻辑）
let lastErrorTime = 0;
const showError = (message) => {
  const now = Date.now();
  if (now - lastErrorTime > 1500) {
    uni.showToast({ title: message, icon: 'error', duration: 3000 }); // 改为3秒
    lastErrorTime = now;
  }
};

// 文件上传方法（支持拦截器）
const uploadFile = (options) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 使用请求拦截器处理通用配置
      const processedOptions = await requestInterceptor({
        url: options.url || '/admin-api/infra/file/upload',
        method: 'POST',
      });

      const uploadOptions = {
        url: processedOptions.url,
        filePath: options.filePath,
        name: options.name || 'file',
        header: processedOptions.header,
        timeout: options.timeout || 15000,
        formData: options.formData || {},
      };

      // 显示loading
      if (options.loading !== false) {
        showLoading(options.loadingText || '上传中...');
      }

      const uploadTask = uni.uploadFile({
        ...uploadOptions,
        success: (res) => {
          if (options.loading !== false) hideLoading();

          if (res.statusCode !== 200) {
            const error = new Error(`HTTP状态码异常: ${res.statusCode}`);
            if (options.showError !== false) showError(error.message);
            return reject(error);
          }

          let data;
          try {
            data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          } catch (e) {
            const error = new Error('响应不是有效JSON');
            if (options.showError !== false) showError(error.message);
            return reject(error);
          }

          // 兼容0/200两种成功码
          if ([0, 200].includes(data?.code)) {
            resolve({
              code: 0,
              data: data.data || data.url,
              msg: 'success',
              raw: res,
            });
          } else {
            const error = new Error(data.msg || `业务错误: ${data.code}`);
            if (options.showError !== false) showError(error.message);
            reject(error);
          }
        },
        fail: (err) => {
          if (options.loading !== false) hideLoading();

          const errorMsg = err.errMsg?.includes('timeout') ? '上传超时' : '网络错误';
          const error = new Error(errorMsg);
          if (options.showError !== false) showError(error.message);
          reject(error);
        },
      });

      // 支持进度回调
      if (options.onProgress && typeof options.onProgress === 'function') {
        uploadTask.onProgressUpdate(options.onProgress);
      }

      // 返回上传任务，支持取消
      if (options.returnTask) {
        resolve(uploadTask);
      }
    } catch (error) {
      if (options.loading !== false) hideLoading();

      const errorResult = new Error('上传请求配置错误');
      if (options.showError !== false) showError(errorResult.message);
      reject(errorResult);
    }
  });
};

// 上传相关接口
export const uploadApi = {
  // 普通POST上传（适用于base64等）
  uploadImage: (data, options = {}) => http.post('/admin-api/infra/file/upload', data, options),

  // 文件上传（适用于文件路径上传）
  uploadFile: (filePath, options = {}) => {
    return uploadFile({
      filePath,
      ...options,
    });
  },

  // 批量文件上传（支持并发控制）
  uploadFiles: async (files, options = {}) => {
    const { concurrency = 3, ...otherOptions } = options;
    const results = [];
    const errors = [];

    // 分批处理，控制并发数
    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);

      const batchPromises = batch.map(async (file, index) => {
        try {
          const globalIndex = i + index;
          const result = await uploadFile({
            filePath: file.filePath || file.url,
            onProgress: (progress) => {
              if (options.onProgress) {
                options.onProgress(globalIndex, progress);
              }
            },
            loadingText: `上传中 ${globalIndex + 1}/${files.length}`,
            ...otherOptions,
          });

          return { index: globalIndex, result, file };
        } catch (error) {
          return { index: globalIndex, error, file };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { index, result: uploadResult, error, file } = result.value;
          if (error) {
            errors.push({ index, error, file });
          } else {
            results.push({ index, result: uploadResult, file });
          }
        }
      });
    }

    return {
      success: results,
      failed: errors,
      total: files.length,
      successCount: results.length,
      failedCount: errors.length,
    };
  },
};
