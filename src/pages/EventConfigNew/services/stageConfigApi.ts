/**
 * 阶段配置API服务
 */

import { request } from '@umijs/max';
import type { StageItem, StageFormValues, ApiResponse, PaginationParams } from '../types';

// 查询阶段列表
export const queryStages = async (params: PaginationParams): Promise<ApiResponse<StageItem[]>> => {
  const response = await request('/api/stage/page', {
    method: 'GET',
    params,
  });
  return response;
};

// 创建阶段
export const createStage = async (values: StageFormValues): Promise<ApiResponse<StageItem>> => {
  const response = await request('/api/stage', {
    method: 'POST',
    data: values,
  });
  return response;
};

// 更新阶段
export const updateStage = async (id: string, values: StageFormValues): Promise<ApiResponse<StageItem>> => {
  const response = await request(`/api/stage/${id}`, {
    method: 'PUT',
    data: values,
  });
  return response;
};

// 删除阶段
export const deleteStage = async (id: string): Promise<ApiResponse> => {
  const response = await request(`/api/stage/${id}`, {
    method: 'DELETE',
  });
  return response;
};
