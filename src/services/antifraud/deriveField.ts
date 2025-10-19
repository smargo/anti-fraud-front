import { request } from '@umijs/max';

// 衍生字段接口定义
export interface DeriveFieldItem {
  id: number;
  eventNo: string;
  fieldName: string;
  fieldType: string;
  fieldDesc?: string;
  processType: string;
  processScript?: string;
  processBean?: string;
  versionCode: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export async function queryDeriveFields(params?: any) {
  return await request('/api/deriveFields/list', {
    method: 'GET',
    params,
  });
}

export async function createDeriveField(data: any) {
  const response = await request('/api/deriveFields', {
    method: 'POST',
    data,
  });

  return response;
}

export async function updateDeriveField(data: any) {
  const response = await request(`/api/deriveFields/${data.id}`, {
    method: 'PUT',
    data,
  });

  return response;
}

export async function deleteDeriveField(id: string) {
  const response = await request(`/api/deriveFields/${id}`, {
    method: 'DELETE',
  });

  return response;
}

export async function getDeriveFieldDetail(id: string) {
  return await request(`/api/deriveFields/${id}`, {
    method: 'GET',
  });
}
