/**
 * 语句依赖API服务
 */

import { request } from '@umijs/max';
import type {
  ApiResponse,
  PaginationParams,
  StatementDependencyFormValues,
  StatementDependencyItem,
} from '../types';
import { StatementDependencyItemPageResponse } from '../types';

// 查询语句依赖列表
export const queryStatementDependencies = async (
  params: PaginationParams,
): Promise<ApiResponse<StatementDependencyItem[]>> => {
  const page: { data: StatementDependencyItem[]; total: number; success: boolean } = await request(
    '/api/statement-dependency/list',
    {
      method: 'GET',
      params,
    },
  );
  return {
    code: page.success ? 'SUCCESS' : 'FAILED',
    message: '',
    records: page.data,
    total: page.total,
    success: page.success,
  } as unknown as ApiResponse<StatementDependencyItem[]>;
};

// 查询语句依赖列表（带名称）
export const queryStatementDependenciesWithNames = async (
  params: PaginationParams,
): Promise<StatementDependencyItemPageResponse> => {
  const page: StatementDependencyItemPageResponse = await request(
    '/api/statement-dependency/list-with-names',
    {
      method: 'GET',
      params,
    },
  );
  return page;
};

// 创建语句依赖
export const createStatementDependency = async (
  values: StatementDependencyFormValues,
): Promise<ApiResponse<StatementDependencyItem>> => {
  return await request('/api/statement-dependency', {
    method: 'POST',
    data: values,
  });
};

// 更新语句依赖
export const updateStatementDependency = async (
  id: string,
  values: StatementDependencyFormValues,
): Promise<ApiResponse<StatementDependencyItem>> => {
  return await request(`/api/statement-dependency/${id}`, {
    method: 'PUT',
    data: values,
  });
};

// 删除语句依赖
export const deleteStatementDependency = async (id: string): Promise<ApiResponse> => {
  return await request(`/api/statement-dependency/${id}`, {
    method: 'DELETE',
  });
};
