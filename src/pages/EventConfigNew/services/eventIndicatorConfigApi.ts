/**
 * 事件指标API服务
 */

import { EventIndicatorItem } from '@/pages/EventIndicatorList/types';
import { ApiResponse, ResultPage } from '@/types/index';
import { request } from '@umijs/max';
import type { EventIndicatorFormValues, PaginationParams } from '../types';

// 查询事件指标列表（带名称）
export const queryEventIndicatorsWithNames = async (
  params: PaginationParams,
): Promise<ResultPage<EventIndicatorItem>> => {
  const page: ResultPage<EventIndicatorItem> = await request(
    '/api/event-indicator/list-with-names',
    {
      method: 'GET',
      params,
    },
  );
  return page;
};

// 创建事件指标
export const createEventIndicator = async (
  values: EventIndicatorFormValues,
): Promise<ApiResponse<boolean>> => {
  return await request('/api/event-indicator', {
    method: 'POST',
    data: values,
  });
};

// 更新事件指标
export const updateEventIndicator = async (
  id: string,
  values: EventIndicatorFormValues,
): Promise<ApiResponse<boolean>> => {
  return await request(`/api/event-indicator/${id}`, {
    method: 'PUT',
    data: values,
  });
};

// 删除事件指标
export const deleteEventIndicator = async (id: string): Promise<ApiResponse<void>> => {
  return await request(`/api/event-indicator/${id}`, {
    method: 'DELETE',
  });
};
