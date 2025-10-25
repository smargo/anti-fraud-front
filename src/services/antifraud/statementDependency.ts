import { StatementDependencyItem } from '@/pages/StatementDependencyList/types';
import { ResultPage } from '@/types/index';
import { request } from '@umijs/max';

// 查询语句依赖（包含语句描述）
export async function queryStatementDependenciesWithNames(
  params: any,
): Promise<ResultPage<StatementDependencyItem>> {
  return request('/api/statement-dependency/list-with-names', {
    method: 'GET',
    params,
  });
}
