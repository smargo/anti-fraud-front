import { EventItem } from '@/pages/EventList/types';
import { ApiResponse, ResultPage } from '@/types';
import { request } from '@umijs/max';

// 查询事件列表
export async function queryEvents(params?: any): Promise<ResultPage<EventItem>> {
  const response: ResultPage<EventItem> = await request('/api/events/list', {
    method: 'GET',
    params,
  });
  return response;
}

// 创建事件
export async function createEvent(data: any): Promise<ApiResponse<boolean>> {
  const response = await request('/api/events', {
    method: 'POST',
    data,
  });

  return response;
}

// 更新事件基本信息（只更新事件名称和描述）
export async function updateEventBasicInfo(
  id: string,
  data: { eventName: string; eventDesc?: string },
): Promise<ApiResponse<boolean>> {
  return await request(`/api/events/${id}/basic-info`, {
    method: 'PUT',
    data: {
      eventName: data.eventName,
      eventDesc: data.eventDesc,
    },
  });
}

// 删除事件
export async function deleteEvent(id: string): Promise<ApiResponse<boolean>> {
  return await request(`/api/events/${id}`, {
    method: 'DELETE',
  });
}
