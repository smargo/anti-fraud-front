import { EventVersionItem, EventVersionQueryParams } from '@/pages/EventVersionList/types';
import { ResultPage } from '@/types';
import { request } from '@umijs/max';

/**
 * 分页查询事件版本列表
 */
export async function queryEventVersions(
  params: EventVersionQueryParams,
): Promise<ResultPage<EventVersionItem>> {
  return request('/api/event-config-version/page', {
    method: 'GET',
    params,
  });
}
