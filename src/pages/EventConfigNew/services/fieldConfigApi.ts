/**
 * 字段配置API服务
 */

import { ApiResponse } from '@/types/index';
import { request } from '@umijs/max';
import type { FieldFormValues, FieldItem, PaginationParams } from '../types';
import { FieldItemPageResponse } from '../types';

// 查询字段列表
export const queryEventFields = async (
  params: PaginationParams,
): Promise<FieldItemPageResponse> => {
  const page: FieldItemPageResponse = await request('/api/eventFields/list', {
    method: 'GET',
    params,
  });
  return page;
};

// 创建字段
export const createEventField = async (
  values: FieldFormValues,
): Promise<ApiResponse<FieldItem>> => {
  return await request('/api/eventFields', {
    method: 'POST',
    data: values,
  });
};

// 更新字段
export const updateEventField = async (
  id: string,
  values: FieldFormValues,
): Promise<ApiResponse<FieldItem>> => {
  return await request(`/api/eventFields/${id}`, {
    method: 'PUT',
    data: values,
  });
};

// 删除字段
export const deleteEventField = async (id: string): Promise<ApiResponse> => {
  return await request(`/api/eventFields/${id}`, {
    method: 'DELETE',
  });
};
