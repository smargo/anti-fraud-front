import { EventIndicatorItem } from '@/pages/EventIndicatorList/types';
import { ResultPage } from '@/types';
import { request } from '@umijs/max';

// 查询事件指标（包含事件名称和指标名称）
export async function queryEventIndicatorsWithNames(params: any) {
  console.log('queryEventIndicatorsWithNames');
  return request<ResultPage<EventIndicatorItem>>('/api/event-indicator/list-with-names', {
    method: 'GET',
    params,
  });
}
