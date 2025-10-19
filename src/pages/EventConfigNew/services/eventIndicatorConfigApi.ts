/**
 * 事件指标API服务
 */

import { request } from '@umijs/max';
import type { EventIndicatorItem, EventIndicatorFormValues, ApiResponse, PaginationParams } from '../types';

// 查询事件指标列表
export const queryEventIndicators = async (params: PaginationParams): Promise<ApiResponse<EventIndicatorItem[]>> => {
  const response = await request('/api/event-indicator/page', {
    method: 'GET',
    params,
  });
  return response;
};

// 查询事件指标列表（带名称）
export const queryEventIndicatorsWithNames = async (params: PaginationParams): Promise<ApiResponse<EventIndicatorItem[]>> => {
  const response = await request('/api/event-indicator/page-with-names', {
    method: 'GET',
    params,
  });
  return response;
};

// 创建事件指标
export const createEventIndicator = async (values: EventIndicatorFormValues): Promise<ApiResponse<EventIndicatorItem>> => {
  const response = await request('/api/event-indicator', {
    method: 'POST',
    data: values,
  });
  return response;
};

// 更新事件指标
export const updateEventIndicator = async (id: string, values: EventIndicatorFormValues): Promise<ApiResponse<EventIndicatorItem>> => {
  const response = await request(`/api/event-indicator/${id}`, {
    method: 'PUT',
    data: values,
  });
  return response;
};

// 删除事件指标
export const deleteEventIndicator = async (id: string): Promise<ApiResponse> => {
  const response = await request(`/api/event-indicator/${id}`, {
    method: 'DELETE',
  });
  return response;
};
