import { EventDetailItem } from '@/pages/EventDetailList/types';
import { ApiResponse, ResultPage } from '@/types';
import { request } from '@umijs/max';

export async function queryEventDetails(params?: any): Promise<ResultPage<EventDetailItem>> {
  const response: ResultPage<EventDetailItem> = await request('/api/eventDetails/list', {
    method: 'GET',
    params,
  });
  return response;
}

export async function createEventDetail(data: any): Promise<ApiResponse<boolean>> {
  return await request('/api/eventDetails', {
    method: 'POST',
    data,
  });
}

export async function updateEventDetail(data: any): Promise<ApiResponse<boolean>> {
  return await request(`/api/eventDetails/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteEventDetail(id: string): Promise<ApiResponse<boolean>> {
  return await request(`/api/eventDetails/${id}`, {
    method: 'DELETE',
  });
}
