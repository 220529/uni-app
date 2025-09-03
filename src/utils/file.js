/**
 * 文件操作工具类
 * 支持PDF预览、图片预览、文件下载、文件类型检测等功能
 */

/**
 * 文件类型枚举
 */
export const FILE_TYPES = {
  PDF: 'pdf',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document',
  UNKNOWN: 'unknown',
};

/**
 * 文件扩展名映射
 */
const FILE_EXTENSIONS = {
  // 图片格式
  image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'],
  // PDF格式
  pdf: ['.pdf'],
  // 视频格式
  video: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
  // 音频格式
  audio: ['.mp3', '.wav', '.aac', '.ogg', '.flac'],
  // 文档格式
  document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
};

/**
 * 检测文件类型
 * @param {string} url 文件URL
 * @returns {string} 文件类型
 */
export function detectFileType(url) {
  if (!url) return FILE_TYPES.UNKNOWN;

  try {
    const extension = url.toLowerCase().split('?')[0].substring(url.lastIndexOf('.'));

    for (const [type, extensions] of Object.entries(FILE_EXTENSIONS)) {
      if (extensions.includes(extension)) {
        return type;
      }
    }

    return FILE_TYPES.UNKNOWN;
  } catch (error) {
    console.error('文件类型检测失败:', error);
    return FILE_TYPES.UNKNOWN;
  }
}

/**
 * 从URL中提取文件名
 * @param {string} url 文件URL
 * @returns {string} 文件名
 */
export function getFileNameFromUrl(url) {
  if (!url) return '';

  try {
    const noQuery = decodeURIComponent(url).split('?')[0];
    const name = noQuery.substring(noQuery.lastIndexOf('/') + 1);
    return name || '';
  } catch (error) {
    console.error('文件名提取失败:', error);
    return '';
  }
}

/**
 * 预览图片文件
 * @param {string|Array} urls 图片URL或URL数组
 * @param {string} current 当前显示的图片URL
 */
export function previewImage(urls, current = '') {
  if (!urls) {
    uni.showToast({ title: '暂无图片', icon: 'none' });
    return;
  }

  const imageUrls = Array.isArray(urls) ? urls : [urls];
  const validUrls = imageUrls.filter((url) => detectFileType(url) === FILE_TYPES.IMAGE);

  if (validUrls.length === 0) {
    uni.showToast({ title: '暂无有效图片', icon: 'none' });
    return;
  }

  uni.previewImage({
    urls: validUrls,
    current: current || validUrls[0],
  });
}

/**
 * 预览PDF文件
 * @param {string|Array} urls PDF文件URL或URL数组
 * @param {string} current 当前要打开的PDF URL
 */
export function previewPdf(urls, current = '') {
  if (!urls) {
    uni.showToast({ title: '暂无PDF文件', icon: 'none' });
    return;
  }

  const pdfUrls = Array.isArray(urls) ? urls : [urls];
  const validUrls = pdfUrls.filter((url) => detectFileType(url) === FILE_TYPES.PDF);

  if (validUrls.length === 0) {
    uni.showToast({ title: '暂无有效PDF文件', icon: 'none' });
    return;
  }

  if (validUrls.length === 1) {
    openPdf(validUrls[0]);
  } else {
    showPdfSelection(validUrls);
  }
}

/**
 * 显示PDF文件选择列表
 * @param {Array} urls PDF文件URL数组
 */
export function showPdfSelection(urls) {
  if (!Array.isArray(urls) || urls.length === 0) {
    uni.showToast({ title: '暂无PDF文件', icon: 'none' });
    return;
  }

  const names = urls.map((url, idx) => getFileNameFromUrl(url) || `PDF ${idx + 1}`);

  uni.showActionSheet({
    itemList: names,
    success: (res) => {
      const chosenUrl = urls[res.tapIndex];
      openPdf(chosenUrl);
    },
  });
}

/**
 * 打开PDF文件
 * @param {string} url PDF文件URL
 */
export function openPdf(url) {
  if (!url) {
    uni.showToast({ title: '无效的PDF地址', icon: 'none' });
    return;
  }

  const encodedUrl = encodeURI(url);

  // #ifdef MP-WEIXIN || APP-PLUS
  uni.showLoading({ title: '加载中' });

  // 在微信小程序中，将文件保存到用户数据目录
  const mpPdfPath = typeof wx !== 'undefined' && wx.env && wx.env.USER_DATA_PATH ? `${wx.env.USER_DATA_PATH}/pdf_${Date.now()}.pdf` : '';

  uni.downloadFile({
    url: encodedUrl,
    filePath: mpPdfPath,
    header: { Accept: 'application/pdf' },
    timeout: 30000,
    success: (res) => {
      const filePath = res.filePath || res.tempFilePath || mpPdfPath;
      if (!filePath) {
        uni.showToast({ title: '文件下载失败', icon: 'none' });
        return;
      }

      uni.openDocument({
        filePath,
        fileType: 'pdf',
        showMenu: true,
        success: () => {},
        fail: (err) => {
          console.error('打开PDF失败:', err);
          uni.showToast({ title: '打开失败，请稍后重试', icon: 'none' });
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
    fail: (err) => {
      console.error('PDF下载失败:', err);
      uni.showToast({ title: '下载失败，请检查网络或域名白名单', icon: 'none' });
    },
    complete: () => {
      uni.hideLoading();
    },
  });
  // #endif

  // #ifdef H5
  try {
    window.open(encodedUrl, '_blank');
  } catch (e) {
    uni.showToast({ title: '请在新窗口查看PDF', icon: 'none' });
  }
  // #endif
}

/**
 * 智能文件预览（自动识别文件类型）
 * @param {string|Array} urls 文件URL或URL数组
 * @param {string} current 当前要显示的文件URL
 */
export function previewFile(urls, current = '') {
  if (!urls) {
    uni.showToast({ title: '暂无文件', icon: 'none' });
    return;
  }

  const fileUrls = Array.isArray(urls) ? urls : [urls];

  // 按文件类型分组
  const groupedFiles = {
    [FILE_TYPES.IMAGE]: [],
    [FILE_TYPES.PDF]: [],
    [FILE_TYPES.VIDEO]: [],
    [FILE_TYPES.AUDIO]: [],
    [FILE_TYPES.DOCUMENT]: [],
    [FILE_TYPES.UNKNOWN]: [],
  };

  fileUrls.forEach((url) => {
    const type = detectFileType(url);
    groupedFiles[type].push(url);
  });

  // 如果只有一种文件类型，直接预览
  const types = Object.keys(groupedFiles).filter((type) => groupedFiles[type].length > 0);

  if (types.length === 1) {
    const type = types[0];
    const urls = groupedFiles[type];

    switch (type) {
      case FILE_TYPES.IMAGE:
        previewImage(urls, current);
        break;
      case FILE_TYPES.PDF:
        previewPdf(urls, current);
        break;
      case FILE_TYPES.VIDEO:
        previewVideo(urls, current);
        break;
      default:
        uni.showToast({ title: '暂不支持该文件类型预览', icon: 'none' });
    }
    return;
  }

  // 多种文件类型，显示选择
  showFileTypeSelection(groupedFiles, current);
}

/**
 * 显示文件类型选择
 * @param {Object} groupedFiles 按类型分组的文件
 * @param {string} current 当前要显示的文件URL
 */
export function showFileTypeSelection(groupedFiles, current = '') {
  const options = [];
  const actions = [];

  if (groupedFiles[FILE_TYPES.IMAGE].length > 0) {
    options.push(`预览图片（${groupedFiles[FILE_TYPES.IMAGE].length}）`);
    actions.push(() => previewImage(groupedFiles[FILE_TYPES.IMAGE], current));
  }

  if (groupedFiles[FILE_TYPES.PDF].length > 0) {
    options.push(`预览PDF（${groupedFiles[FILE_TYPES.PDF].length}）`);
    actions.push(() => previewPdf(groupedFiles[FILE_TYPES.PDF], current));
  }

  if (groupedFiles[FILE_TYPES.VIDEO].length > 0) {
    options.push(`预览视频（${groupedFiles[FILE_TYPES.VIDEO].length}）`);
    actions.push(() => previewVideo(groupedFiles[FILE_TYPES.VIDEO], current));
  }

  if (options.length === 0) {
    uni.showToast({ title: '暂不支持该文件类型预览', icon: 'none' });
    return;
  }

  uni.showActionSheet({
    itemList: options,
    success: (res) => {
      if (actions[res.tapIndex]) {
        actions[res.tapIndex]();
      }
    },
  });
}

/**
 * 预览视频文件
 * @param {string|Array} urls 视频文件URL或URL数组
 * @param {string} current 当前要播放的视频URL
 */
export function previewVideo(urls, current = '') {
  if (!urls) {
    uni.showToast({ title: '暂无视频文件', icon: 'none' });
    return;
  }

  const videoUrls = Array.isArray(urls) ? urls : [urls];
  const validUrls = videoUrls.filter((url) => detectFileType(url) === FILE_TYPES.VIDEO);

  if (validUrls.length === 0) {
    uni.showToast({ title: '暂无有效视频文件', icon: 'none' });
    return;
  }

  // 跳转到视频预览页面
  uni.navigateTo({
    url: `/pages/tools/video-preview/index?urls=${encodeURIComponent(JSON.stringify(validUrls))}&current=${encodeURIComponent(current || validUrls[0])}`,
  });
}

/**
 * 下载文件
 * @param {string} url 文件URL
 * @param {string} fileName 文件名（可选）
 */
export function downloadFile(url, fileName = '') {
  if (!url) {
    uni.showToast({ title: '无效的文件地址', icon: 'none' });
    return;
  }

  const name = fileName || getFileNameFromUrl(url);

  uni.showLoading({ title: '下载中' });

  uni.downloadFile({
    url: encodeURI(url),
    success: (res) => {
      if (res.statusCode === 200) {
        uni.saveFile({
          tempFilePath: res.tempFilePath,
          success: (saveRes) => {
            uni.showToast({ title: '文件保存成功', icon: 'success' });
          },
          fail: () => {
            uni.showToast({ title: '文件保存失败', icon: 'none' });
          },
        });
      } else {
        uni.showToast({ title: '下载失败', icon: 'none' });
      }
    },
    fail: () => {
      uni.showToast({ title: '下载失败，请检查网络', icon: 'none' });
    },
    complete: () => {
      uni.hideLoading();
    },
  });
}

/**
 * 复制文件链接到剪贴板
 * @param {string} url 文件URL
 */
export function copyFileUrl(url) {
  if (!url) {
    uni.showToast({ title: '无效的文件地址', icon: 'none' });
    return;
  }

  uni.setClipboardData({
    data: url,
    success: () => {
      uni.showToast({ title: '链接已复制', icon: 'success' });
    },
  });
}

/**
 * 获取文件大小（如果URL包含文件大小信息）
 * @param {string} url 文件URL
 * @returns {string} 格式化的文件大小
 */
export function getFileSize(url) {
  // 这里可以根据实际需求实现文件大小获取逻辑
  // 可能需要通过HEAD请求获取Content-Length
  return '';
}

/**
 * 检查文件是否可预览
 * @param {string} url 文件URL
 * @returns {boolean} 是否可预览
 */
export function isPreviewable(url) {
  const type = detectFileType(url);
  return [FILE_TYPES.IMAGE, FILE_TYPES.PDF, FILE_TYPES.VIDEO].includes(type);
}

export default {
  FILE_TYPES,
  detectFileType,
  getFileNameFromUrl,
  previewImage,
  previewPdf,
  previewVideo,
  previewFile,
  downloadFile,
  copyFileUrl,
  getFileSize,
  isPreviewable,
};
