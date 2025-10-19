import { request } from '@umijs/max';

export async function queryEventDetails(params?: any) {
  const response = await request('/api/eventDetails/list', {
    method: 'GET',
    params,
  });
  return response;
}

export async function createEventDetail(data: any) {
  return await request('/api/eventDetails', {
    method: 'POST',
    data,
  });
}

export async function updateEventDetail(data: any) {
  return await request(`/api/eventDetails/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteEventDetail(id: string) {
  return await request(`/api/eventDetails/${id}`, {
    method: 'DELETE',
  });
}

export async function getEventDetail(id: string) {
  return await request(`/api/eventDetails/${id}`, {
    method: 'GET',
  });
}
