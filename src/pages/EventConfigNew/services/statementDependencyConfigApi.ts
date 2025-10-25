/**
 * 语句依赖API服务
 */

import {
  StatementDependencyFormValues,
  StatementDependencyItem,
} from '@/pages/StatementDependencyList/types';
import { ApiResponse, ResultPage } from '@/types/index';
import { request } from '@umijs/max';
import type { PaginationParams } from '../types';

// 查询语句依赖列表（带名称）
export const queryStatementDependenciesWithNames = async (
  params: PaginationParams,
): Promise<ResultPage<StatementDependencyItem>> => {
  const page: ResultPage<StatementDependencyItem> = await request(
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
): Promise<ApiResponse<boolean>> => {
  return await request('/api/statement-dependency', {
    method: 'POST',
    data: values,
  });
};

// 更新语句依赖
export const updateStatementDependency = async (
  id: string,
  values: StatementDependencyFormValues,
): Promise<ApiResponse<boolean>> => {
  return await request(`/api/statement-dependency/${id}`, {
    method: 'PUT',
    data: values,
  });
};

// 删除语句依赖
export const deleteStatementDependency = async (id: string): Promise<ApiResponse<boolean>> => {
  return await request(`/api/statement-dependency/${id}`, {
    method: 'DELETE',
  });
};
