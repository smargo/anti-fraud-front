/**
 * 字段配置API服务
 */

import { request } from '@umijs/max';
import type { FieldItem, FieldFormValues, ApiResponse, PaginationParams } from '../types';

// 查询字段列表
export const queryEventFields = async (params: PaginationParams): Promise<ApiResponse<FieldItem[]>> => {
  const response = await request('/api/field/page', {
    method: 'GET',
    params,
  });
  return response;
};

// 创建字段
export const createEventField = async (values: FieldFormValues): Promise<ApiResponse<FieldItem>> => {
  const response = await request('/api/field', {
    method: 'POST',
    data: values,
  });
  return response;
};

// 更新字段
export const updateEventField = async (id: string, values: FieldFormValues): Promise<ApiResponse<FieldItem>> => {
  const response = await request(`/api/field/${id}`, {
    method: 'PUT',
    data: values,
  });
  return response;
};

// 删除字段
export const deleteEventField = async (id: string): Promise<ApiResponse> => {
  const response = await request(`/api/field/${id}`, {
    method: 'DELETE',
  });
  return response;
};
