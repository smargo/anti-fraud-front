import { request } from '@umijs/max';

// 事件指标接口
export interface EventIndicatorItem {
  id: string;
  eventNo: string;
  indicatorNo: string;
  indicatorName: string;
  createdDate: string;
}

// 事件指标接口（包含事件名称和指标名称）
export interface EventIndicatorWithNamesItem {
  id: string;
  eventNo: string;
  eventName: string;
  indicatorNo: string;
  indicatorName: string;
  versionCode?: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

// 查询事件指标
export async function queryEventIndicators(params: any) {
  return request<EventIndicatorItem[]>('/api/event-indicator/list', {
    method: 'GET',
    params,
  });
}

// 查询事件指标（包含事件名称和指标名称）
export async function queryEventIndicatorsWithNames(params: any) {
  return request<EventIndicatorWithNamesItem[]>('/api/event-indicator/list-with-names', {
    method: 'GET',
    params,
  });
}

// 创建事件指标
export async function createEventIndicator(data: EventIndicatorItem) {
  const response = await request('/api/event-indicator', {
    method: 'POST',
    data,
  });

  return response;
}

// 更新事件指标
export async function updateEventIndicator(data: EventIndicatorItem) {
  const response = await request(`/api/event-indicator/${data.id}`, {
    method: 'PUT',
    data,
  });

  return response;
}

// 删除事件指标
export async function deleteEventIndicator(id: string) {
  const response = await request(`/api/event-indicator/${id}`, {
    method: 'DELETE',
  });

  return response;
}
