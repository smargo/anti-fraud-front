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

/**
 * 获取事件版本详情
 */
export async function getEventVersionById(id: number): Promise<EventVersionItem> {
  return request(`/api/event-config-version/${id}`, {
    method: 'GET',
  });
}

/**
 * 激活版本
 */
export async function activateVersion(id: number): Promise<void> {
  return request(`/api/event-config-version/${id}/activate`, {
    method: 'POST',
  });
}

/**
 * 复制版本
 */
export async function copyVersion(id: number, newVersionCode: string): Promise<EventVersionItem> {
  return request(`/api/event-config-version/${id}/copy`, {
    method: 'POST',
    data: { newVersionCode },
  });
}

/**
 * 回滚到指定版本
 */
export async function rollbackToVersion(id: number): Promise<void> {
  return request(`/api/event-config-version/${id}/rollback`, {
    method: 'POST',
  });
}

/**
 * 删除版本
 */
export async function deleteVersion(id: number): Promise<void> {
  return request(`/api/event-config-version/${id}`, {
    method: 'DELETE',
  });
}
