import { FieldItem } from '@/pages/FieldList/types';
import { ResultPage } from '@/types';
import { request } from '@umijs/max';

// 查询事件字段列表
export async function queryEventFields(params?: any): Promise<ResultPage<FieldItem>> {
  const response = await request('/api/eventFields/list', {
    method: 'GET',
    params,
  });
  return response;
}
