/**
 * 事件指标API服务
 */

import { request } from '@umijs/max';
import type { EventIndicatorItem, EventIndicatorFormValues, ApiResponse, PaginationParams } from '../types';

// 查询事件指标列表
export const queryEventIndicators = async (params: PaginationParams): Promise<ApiResponse<EventIndicatorItem[]>> => {
  const page: { data: EventIndicatorItem[]; total: number; success: boolean } = await request('/api/event-indicator/list', {
    method: 'GET',
    params,
  });
  return {
    code: page.success ? 'SUCCESS' : 'FAILED',
    message: '',
    records: page.data,
    total: page.total,
    success: page.success,
  } as unknown as ApiResponse<EventIndicatorItem[]>;
};

// 查询事件指标列表（带名称）
export const queryEventIndicatorsWithNames = async (params: PaginationParams): Promise<ApiResponse<EventIndicatorItem[]>> => {
  const page: { data: EventIndicatorItem[]; total: number; success: boolean } = await request('/api/event-indicator/list-with-names', {
    method: 'GET',
    params,
  });
  return {
    code: page.success ? 'SUCCESS' : 'FAILED',
    message: '',
    records: page.data,
    total: page.total,
    success: page.success,
  } as unknown as ApiResponse<EventIndicatorItem[]>;
};

// 创建事件指标
export const createEventIndicator = async (values: EventIndicatorFormValues): Promise<ApiResponse<EventIndicatorItem>> => {
  return await request('/api/event-indicator', {
    method: 'POST',
    data: values,
  });
};

// 更新事件指标
export const updateEventIndicator = async (id: string, values: EventIndicatorFormValues): Promise<ApiResponse<EventIndicatorItem>> => {
  return await request(`/api/event-indicator/${id}`, {
    method: 'PUT',
    data: values,
  });
};

// 删除事件指标
export const deleteEventIndicator = async (id: string): Promise<ApiResponse> => {
  return await request(`/api/event-indicator/${id}`, {
    method: 'DELETE',
  });
};
