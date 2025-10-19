/**
 * 衍生字段API服务
 */

import { request } from '@umijs/max';
import type { DeriveFieldItem, DeriveFieldFormValues, ApiResponse, PaginationParams } from '../types';

// 查询衍生字段列表
export const queryDeriveFields = async (params: PaginationParams): Promise<ApiResponse<DeriveFieldItem[]>> => {
  const response = await request('/api/derive-field/page', {
    method: 'GET',
    params,
  });
  return response;
};

// 创建衍生字段
export const createDeriveField = async (values: DeriveFieldFormValues): Promise<ApiResponse<DeriveFieldItem>> => {
  const response = await request('/api/derive-field', {
    method: 'POST',
    data: values,
  });
  return response;
};

// 更新衍生字段
export const updateDeriveField = async (id: string, values: DeriveFieldFormValues): Promise<ApiResponse<DeriveFieldItem>> => {
  const response = await request(`/api/derive-field/${id}`, {
    method: 'PUT',
    data: values,
  });
  return response;
};

// 删除衍生字段
export const deleteDeriveField = async (id: string): Promise<ApiResponse> => {
  const response = await request(`/api/derive-field/${id}`, {
    method: 'DELETE',
  });
  return response;
};
