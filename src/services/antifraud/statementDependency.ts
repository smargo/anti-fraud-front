import { request } from '@umijs/max';

// 语句依赖接口
export interface StatementDependencyItem {
  id: string;
  eventNo: string;
  statementNo: string;
  dependStatementNo: string;
  createdDate: string;
}

// 语句依赖扩展接口（包含语句描述）
export interface StatementDependencyWithNamesItem {
  id: string;
  eventNo: string;
  statementNo: string;
  dependStatementNo: string;
  statementDesc?: string;
  dependStatementDesc?: string;
  enable: string;
  versionCode?: string;
  createdDate: string;
  lastModifiedDate: string;
  createdBy: string;
  lastModifiedBy: string;
}

// 查询语句依赖
export async function queryStatementDependencies(params: any) {
  return request<StatementDependencyItem[]>('/api/statement-dependency/list', {
    method: 'GET',
    params,
  });
}

// 查询语句依赖（包含语句描述）
export async function queryStatementDependenciesWithNames(params: any) {
  return request<StatementDependencyWithNamesItem[]>('/api/statement-dependency/list-with-names', {
    method: 'GET',
    params,
  });
}

// 创建语句依赖
export async function createStatementDependency(data: StatementDependencyItem) {
  const response = await request('/api/statement-dependency', {
    method: 'POST',
    data,
  });

  return response;
}

// 更新语句依赖
export async function updateStatementDependency(data: StatementDependencyItem) {
  const response = await request(`/api/statement-dependency/${data.id}`, {
    method: 'PUT',
    data,
  });

  return response;
}

// 删除语句依赖
export async function deleteStatementDependency(id: string) {
  const response = await request(`/api/statement-dependency/${id}`, {
    method: 'DELETE',
  });

  return response;
}
