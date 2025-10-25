/**
 * 阶段配置API服务
 */

import { StageItem } from '@/pages/StageList/types';
import { ApiResponse, ResultPage } from '@/types/index';
import { request } from '@umijs/max';
import type { PaginationParams } from '../types';

// 查询阶段列表
export const queryStages = async (params: PaginationParams): Promise<ResultPage<StageItem>> => {
  const page: ResultPage<StageItem> = await request('/api/stage/page', {
    method: 'GET',
    params,
  });
  return page;
};

// 创建阶段
export const createStage = async (values: StageItem): Promise<ApiResponse<boolean>> => {
  return await request('/api/stage', {
    method: 'POST',
    data: values,
  });
};

// 更新阶段
export const updateStage = async (id: string, values: StageItem): Promise<ApiResponse<boolean>> => {
  return await request(`/api/stage/${id}`, {
    method: 'PUT',
    data: values,
  });
};

// 删除阶段
export const deleteStage = async (id: string): Promise<ApiResponse<boolean>> => {
  return await request(`/api/stage/${id}`, {
    method: 'DELETE',
  });
};
