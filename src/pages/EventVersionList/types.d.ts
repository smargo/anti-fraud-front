/**
 * EventVersionList 页面类型定义
 */

export interface EventVersionItem {
  id: number;
  eventNo: string;
  versionCode: string;
  versionDesc?: string;
  status: string;
  eventType?: string;
  eventGroup?: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

// 查询参数
export interface EventVersionQueryParams {
  current?: number;
  pageSize?: number;
  eventNo?: string;
  versionCode?: string;
  versionDesc?: string;
  status?: string;
  eventType?: string;
}

export interface EventVersionViewProps {
  viewingVersion: EventVersionItem | null;
  versionStatusOptions: import('@/utils/dictUtils').DictItem[];
  eventTypeOptions: import('@/utils/dictUtils').DictItem[];
  eventGroupOptions: import('@/utils/dictUtils').DictItem[];
}
