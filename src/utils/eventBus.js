// 事件总线 - 基于 uni 事件系统的轻量包装器
class EventBus {
  on(eventName, callback) {
    uni.$on(eventName, callback);
  }

  off(eventName, callback) {
    uni.$off(eventName, callback);
  }

  emit(eventName, data) {
    uni.$emit(eventName, data);
  }

  clear() {
    console.warn('EventBus.clear() 暂不支持，请手动调用 off() 移除事件');
  }
}

export const eventBus = new EventBus();

export const EVENT_NAMES = {
  PROJECT_DETAIL_REFRESH: 'PROJECT_DETAIL_REFRESH',
  PROJECT_DATA_UPDATED: 'PROJECT_DATA_UPDATED',
  TASK_DATA_UPDATED: 'TASK_DATA_UPDATED',
  MATERIAL_SELECTION_UPDATED: 'MATERIAL_SELECTION_UPDATED',
  MATERIAL_MANAGEMENT_REFRESH: 'MATERIAL_MANAGEMENT_REFRESH',
  ADDRESS_CHANGED: 'ADDRESS_CHANGED',
};
