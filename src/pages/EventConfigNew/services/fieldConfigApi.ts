/**
 * 字段配置API服务
 */

import { FieldItem } from '@/pages/FieldList/types';
import { ApiResponse, ResultPage } from '@/types/index';
import { request } from '@umijs/max';
import type { PaginationParams } from '../types';

// 查询字段列表
export const queryEventFields = async (
  params: PaginationParams,
): Promise<ResultPage<FieldItem>> => {
  const page: ResultPage<FieldItem> = await request('/api/eventFields/list', {
    method: 'GET',
    params,
  });
  return page;
};

// 创建字段
export const createEventField = async (values: FieldItem): Promise<ApiResponse<boolean>> => {
  return await request('/api/eventFields', {
    method: 'POST',
    data: values,
  });
};

// 更新字段
export const updateEventField = async (
  id: string,
  values: FieldItem,
): Promise<ApiResponse<boolean>> => {
  return await request(`/api/eventFields/${id}`, {
    method: 'PUT',
    data: values,
  });
};

// 删除字段
export const deleteEventField = async (id: string): Promise<ApiResponse<boolean>> => {
  return await request(`/api/eventFields/${id}`, {
    method: 'DELETE',
  });
};
