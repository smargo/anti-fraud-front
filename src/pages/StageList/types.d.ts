/**
 * StageList 页面类型定义
 */

export interface StageItem {
  id?: number;
  eventNo: string;
  versionCode: string;
  stageNo: string;
  stageName: string;
  stageBean?: string;
  stageParam?: string;
  createdDate: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}
