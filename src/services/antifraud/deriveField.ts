import { DeriveFieldItem } from '@/pages/DeriveFieldList/types';
import { PaginationParams } from '@/pages/EventConfigNew/types';
import { ResultPage } from '@/types';
import { request } from '@umijs/max';

// 查询衍生字段列表
export const queryDeriveFields = async (
  params: PaginationParams,
): Promise<ResultPage<DeriveFieldItem>> => {
  const page: ResultPage<DeriveFieldItem> = await request('/api/deriveFields/list', {
    method: 'GET',
    params,
  });
  return page;
};

export async function getDeriveFieldDetail(id: string): Promise<DeriveFieldItem> {
  return await request(`/api/deriveFields/${id}`, {
    method: 'GET',
  });
}
