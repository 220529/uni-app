/**
 * TokenManager 配置 - 极简版
 */

import { tokenManager } from './tokenManager.js';

// 基础配置
export const enableAutoRefresh = () => tokenManager.setAutoRefresh(true);
export const disableAutoRefresh = () => tokenManager.setAutoRefresh(false);
export const checkOnAppResume = () => tokenManager.checkOnAppResume();
