import { request } from '@umijs/max';

// 查询处理流程列表
export async function queryStages(params?: any) {
  return request('/api/stage/page', {
    method: 'GET',
    params,
  });
}
