// 获取环境变量值（只用 import.meta.env）
function getEnvValue(key, defaultValue = undefined) {
  return import.meta.env[key] ?? defaultValue;
}

// 获取当前环境
function getCurrentEnv() {
  return import.meta.env.MODE || 'development';
}

// 检查是否为开发环境
function isDevelopment() {
  return getCurrentEnv() === 'development';
}

// 检查是否为生产环境
function isProduction() {
  return getCurrentEnv() === 'production';
}

// 默认配置
const DEFAULT_CONFIG = {
  // API配置
  API_BASE_URL: 'https://api.example.com',
  
  // 请求头配置
  TENANT_ID: '1',
  LOGIN_USER_TYPE: '3',
  
  // 应用配置
  APP_NAME: 'CPM微信小程序',
  APP_VERSION: '1.0.0',
  
  // 地图配置
  TENCENT_MAP_KEY: '',
  
  // 其他配置
  TIMEOUT: 15000,
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
};

// 封装配置对象
function getCurrentConfig() {
  const env = getCurrentEnv();
  
  return {
    // 基础配置
    NODE_ENV: env,
    ENV_NAME: getEnvValue('VITE_ENV_NAME', env),
    
    // API配置
    API_BASE_URL: getEnvValue('VITE_API_BASE_URL', DEFAULT_CONFIG.API_BASE_URL),
    
    // 请求头配置
    TENANT_ID: getEnvValue('VITE_TENANT_ID', DEFAULT_CONFIG.TENANT_ID),
    LOGIN_USER_TYPE: getEnvValue('VITE_LOGIN_USER_TYPE', DEFAULT_CONFIG.LOGIN_USER_TYPE),
    
    // 应用配置
    APP_NAME: getEnvValue('VITE_APP_NAME', DEFAULT_CONFIG.APP_NAME),
    APP_VERSION: getEnvValue('VITE_APP_VERSION', DEFAULT_CONFIG.APP_VERSION),
    
    // 地图配置
    TENCENT_MAP_KEY: getEnvValue('VITE_TENCENT_MAP_KEY', DEFAULT_CONFIG.TENCENT_MAP_KEY),
    
    // 其他配置
    TIMEOUT: getEnvValue('VITE_TIMEOUT', DEFAULT_CONFIG.TIMEOUT),
    MAX_FILE_SIZE: getEnvValue('VITE_MAX_FILE_SIZE', DEFAULT_CONFIG.MAX_FILE_SIZE),
    
    // 功能开关
    ENABLE_DEBUG: getEnvValue('VITE_ENABLE_DEBUG', isDevelopment()),
    ENABLE_MOCK: getEnvValue('VITE_ENABLE_MOCK', false),
    ENABLE_VCONSOLE: getEnvValue('VITE_ENABLE_VCONSOLE', isDevelopment()),
  };
}

// 导出统一配置
export const config = getCurrentConfig();

// 导出便捷变量
export const NODE_ENV = config.NODE_ENV;
export const ENV_NAME = config.ENV_NAME;
export const API_BASE_URL = config.API_BASE_URL;
export const TENANT_ID = config.TENANT_ID;
export const LOGIN_USER_TYPE = config.LOGIN_USER_TYPE;
export const APP_NAME = config.APP_NAME;
export const APP_VERSION = config.APP_VERSION;
export const TENCENT_MAP_KEY = config.TENCENT_MAP_KEY;
export const TIMEOUT = config.TIMEOUT;
export const MAX_FILE_SIZE = config.MAX_FILE_SIZE;

// 功能开关
export const ENABLE_DEBUG = config.ENABLE_DEBUG;
export const ENABLE_MOCK = config.ENABLE_MOCK;
export const ENABLE_VCONSOLE = config.ENABLE_VCONSOLE;

// 环境判断函数
export const isDev = isDevelopment();
export const isProd = isProduction();

// 导出环境判断函数
export { isDevelopment, isProduction };

// 调试信息
if (isDev && ENABLE_DEBUG) {
  console.log('🔧 当前环境配置:', config);
  console.log('🔧 完整 import.meta.env:', import.meta.env);
}

export default config;
