/**
 * 字段配置API服务
 */

import { request } from '@umijs/max';
import type { FieldItem, FieldFormValues, ApiResponse, PaginationParams } from '../types';

// 查询字段列表
export const queryEventFields = async (params: PaginationParams): Promise<ApiResponse<FieldItem[]>> => {
  const page: { data: FieldItem[]; total: number; success: boolean } = await request('/api/eventFields/list', {
    method: 'GET',
    params,
  });
  return {
    code: page.success ? 'SUCCESS' : 'FAILED',
    message: '',
    records: page.data,
    total: page.total,
    success: page.success,
  } as unknown as ApiResponse<FieldItem[]>;
};

// 创建字段
export const createEventField = async (values: FieldFormValues): Promise<ApiResponse<FieldItem>> => {
  return await request('/api/eventFields', {
    method: 'POST',
    data: values,
  });
};

// 更新字段
export const updateEventField = async (id: string, values: FieldFormValues): Promise<ApiResponse<FieldItem>> => {
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
