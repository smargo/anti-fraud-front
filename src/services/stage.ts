import { request } from '@umijs/max';

// 查询处理流程列表
export async function queryStages(params?: any) {
  return request('/api/stage/page', {
    method: 'GET',
    params,
  });
}

// 创建处理流程
export async function createStage(data: any) {
  const response = await request('/api/stage', {
    method: 'POST',
    data,
  });
  
  return response;
}

// 更新处理流程
export async function updateStage(data: any) {
  const response = await request(`/api/stage/${data.id}`, {
    method: 'PUT',
    data,
  });
  
  return response;
}

// 删除处理流程
export async function deleteStage(id: string) {
  const response = await request(`/api/stage/${id}`, {
    method: 'DELETE',
  });
  
  return response;
}

// 获取处理流程详情
export async function getStageDetail(id: string) {
  return await request(`/api/stage/${id}`, {
    method: 'GET',
  });
}