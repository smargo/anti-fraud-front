import { request } from '@umijs/max';

// 事件版本接口定义
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

// 分页响应
export interface EventVersionPageResponse {
  records: EventVersionItem[];
  total: number;
  current: number;
  size: number;
}

/**
 * 分页查询事件版本列表
 */
export async function queryEventVersions(
  params: EventVersionQueryParams,
): Promise<EventVersionPageResponse> {
  return request('/api/event-config-version/page', {
    method: 'GET',
    params,
  });
}
