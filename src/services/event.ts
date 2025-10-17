import { request } from '@umijs/max';

// 查询事件列表
export async function queryEvents(params?: any) {
  // 如果后端服务不可用，返回Mock数据
  const response = await request('/api/events/list', {
    method: 'GET',
    params,
  });
  return response;
}

// 创建事件
export async function createEvent(data: any) {
  const response = await request('/api/events', {
    method: 'POST',
    data,
  });
  
  return response;
}

// 更新事件
export async function updateEvent(data: any) {
  return await request(`/api/events/${data.id}`, {
    method: 'PUT',
    data,
  });
}

// 更新事件基本信息（只更新事件名称和描述）
export async function updateEventBasicInfo(id: string, data: { eventName: string; eventDesc?: string }) {
  return await request(`/api/events/${id}/basic-info`, {
    method: 'PUT',
    data: {
      eventName: data.eventName,
      eventDesc: data.eventDesc
    },
  });
}

// 获取事件详情记录
export async function getEventDetailRecord(eventTransNo: string) {
  return await request(`/api/events/records/${eventTransNo}`, {
    method: 'GET',
  });

}

// 删除事件
export async function deleteEvent(id: string) {
    return await request(`/api/events/${id}`, {
      method: 'DELETE',
    });
}

// 查询事件详情记录列表
export async function queryEventDetailRecords(params?: any) {
  return await request('/api/events/records', {
    method: 'GET',
    params,
  });
}

// 获取事件详情
export async function getEventDetail(eventNo: string) {
  return await request(`/api/events/${eventNo}`, {
    method: 'GET',
  });
}

// 根据eventNo查询事件
export async function getEventByEventNo(eventNo: string) {
  return await request(`/api/events/eventNo/${eventNo}`, {
    method: 'GET',
  });
}