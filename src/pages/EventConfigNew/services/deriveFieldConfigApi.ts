/**
 * 衍生字段API服务
 */

import { request } from '@umijs/max';
import type { DeriveFieldItem, DeriveFieldFormValues, ApiResponse, PaginationParams } from '../types';

// 查询衍生字段列表
export const queryDeriveFields = async (params: PaginationParams): Promise<ApiResponse<DeriveFieldItem[]>> => {
  const page: { data: DeriveFieldItem[]; total: number; success: boolean } = await request('/api/deriveFields/list', {
    method: 'GET',
    params,
  });
  return {
    code: page.success ? 'SUCCESS' : 'FAILED',
    message: '',
    records: page.data,
    total: page.total,
    success: page.success,
  } as unknown as ApiResponse<DeriveFieldItem[]>;
};

// 创建衍生字段
export const createDeriveField = async (values: DeriveFieldFormValues): Promise<ApiResponse<DeriveFieldItem>> => {
  return await request('/api/deriveFields', {
    method: 'POST',
    data: values,
  });
};

// 更新衍生字段
export const updateDeriveField = async (id: string, values: DeriveFieldFormValues): Promise<ApiResponse<DeriveFieldItem>> => {
  return await request(`/api/deriveFields/${id}`, {
    method: 'PUT',
    data: values,
  });
};

// 删除衍生字段
export const deleteDeriveField = async (id: string): Promise<ApiResponse> => {
  return await request(`/api/deriveFields/${id}`, {
    method: 'DELETE',
  });
};
