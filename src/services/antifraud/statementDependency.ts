import { ResultPage } from '@/pages/EventConfigNew/types';
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

// 查询语句依赖（包含语句描述）
export async function queryStatementDependenciesWithNames(
  params: any,
): Promise<ResultPage<StatementDependencyWithNamesItem>> {
  return request('/api/statement-dependency/list-with-names', {
    method: 'GET',
    params,
  });
}
