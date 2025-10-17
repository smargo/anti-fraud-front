import { request } from '@umijs/max';

// 查询事件字段列表
export async function queryEventFields(params?: any) {
  const response = await request('/api/eventFields/list', {
    method: 'GET',
    params,
  });
  return response;
}

// 创建事件字段
export async function createEventField(data: any) {
  const response = await request('/api/eventFields', {
    method: 'POST',
    data,
  });
  
  return response;
}

// 更新事件字段
export async function updateEventField(data: any) {
  const response = await request(`/api/eventFields/${data.id}`, {
    method: 'PUT',
    data,
  });
  
  return response;
}

// 删除事件字段
export async function deleteEventField(id: string) {
  const response = await request(`/api/eventFields/${id}`, {
    method: 'DELETE',
  });
  
  return response;
}

// 获取事件字段详情
export async function getEventFieldDetail(id: string) {
  return await request(`/api/eventFields/${id}`, {
    method: 'GET',
  });
} 