/**
 * 衍生字段API服务
 */

import { request } from '@umijs/max';
import type {
  ApiResponse,
  DeriveFieldFormValues,
  DeriveFieldItem,
  PaginationParams,
} from '../types';
import { DeriveFieldItemPageResponse } from '../types';

// 查询衍生字段列表
export const queryDeriveFields = async (
  params: PaginationParams,
): Promise<DeriveFieldItemPageResponse> => {
  const page: DeriveFieldItemPageResponse = await request('/api/deriveFields/list', {
    method: 'GET',
    params,
  });
  return page;
};

// 创建衍生字段
export const createDeriveField = async (
  values: DeriveFieldFormValues,
): Promise<ApiResponse<DeriveFieldItem>> => {
  return await request('/api/deriveFields', {
    method: 'POST',
    data: values,
  });
};

// 更新衍生字段
export const updateDeriveField = async (
  id: string,
  values: DeriveFieldFormValues,
): Promise<ApiResponse<DeriveFieldItem>> => {
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
