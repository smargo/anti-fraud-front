/**
 * EventConfig 工具函数
 */

import { EventConfigVersion } from '../types';

/**
 * 选择最佳版本（生效版本 > 草稿版本）
 */
export const selectBestVersion = (versionHistory: EventConfigVersion[]): EventConfigVersion | null => {
  if (!versionHistory || versionHistory.length === 0) {
    return null;
  }
  
  // 优先选择生效中的版本
  const activeVersion = versionHistory.find(v => v.status === 'ACTIVE');
  if (activeVersion) {
    return activeVersion;
  }
  
  // 其次选择草稿版本
  const draftVersion = versionHistory.find(v => v.status === 'DRAFT');
  if (draftVersion) {
    return draftVersion;
  }
  
  // 最后选择已审批的版本
  const approvedVersion = versionHistory.find(v => v.status === 'APPROVED');
  if (approvedVersion) {
    return approvedVersion;
  }
  
  // 如果都没有，返回第一个版本
  return versionHistory[0];
};

/**
 * 检查是否有草稿版本
 */
export const hasDraftVersion = (versionHistory: EventConfigVersion[]): boolean => {
  return versionHistory.some(v => v.status === 'DRAFT');
};

/**
 * 检查是否应该显示编辑界面
 */
export const shouldShowEditInterface = (
  configEventLoadProp: any,
  isReadOnly: boolean
): boolean => {
  return configEventLoadProp && 
         configEventLoadProp.specifyVersion && 
         configEventLoadProp.specifyVersion.id && 
         configEventLoadProp.specifyVersion.versionCode &&
         !isReadOnly;
};

/**
 * 生成页面标题 - 完全按照原页面逻辑
 */
export const getPageTitle = (eventDetail: any, eventNo: string): string => {
  if (eventDetail) {
    return `事件配置-${eventDetail.eventName || '未知事件'}(${eventDetail.eventNo || eventNo})`;
  }
  return `事件配置-${eventNo}`;
};
