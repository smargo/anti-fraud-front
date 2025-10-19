/**
 * 语句依赖API服务
 */

import { request } from '@umijs/max';
import type { StatementDependencyItem, StatementDependencyFormValues, ApiResponse, PaginationParams } from '../types';

// 查询语句依赖列表
export const queryStatementDependencies = async (params: PaginationParams): Promise<ApiResponse<StatementDependencyItem[]>> => {
  const response = await request('/api/statement-dependency/page', {
    method: 'GET',
    params,
  });
  return response;
};

// 查询语句依赖列表（带名称）
export const queryStatementDependenciesWithNames = async (params: PaginationParams): Promise<ApiResponse<StatementDependencyItem[]>> => {
  const response = await request('/api/statement-dependency/page-with-names', {
    method: 'GET',
    params,
  });
  return response;
};

// 创建语句依赖
export const createStatementDependency = async (values: StatementDependencyFormValues): Promise<ApiResponse<StatementDependencyItem>> => {
  const response = await request('/api/statement-dependency', {
    method: 'POST',
    data: values,
  });
  return response;
};

// 更新语句依赖
export const updateStatementDependency = async (id: string, values: StatementDependencyFormValues): Promise<ApiResponse<StatementDependencyItem>> => {
  const response = await request(`/api/statement-dependency/${id}`, {
    method: 'PUT',
    data: values,
  });
  return response;
};

// 删除语句依赖
export const deleteStatementDependency = async (id: string): Promise<ApiResponse> => {
  const response = await request(`/api/statement-dependency/${id}`, {
    method: 'DELETE',
  });
  return response;
};
