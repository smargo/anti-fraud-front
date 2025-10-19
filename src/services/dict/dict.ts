import { request } from '@umijs/max';

// 查询系统字典列表
export async function queryDicts(params?: any) {
  return await request('/api/dict/list', {
    method: 'GET',
    params,
  });
}

// 创建系统字典
export async function createDict(data: any) {
  return await request('/api/dict', {
    method: 'POST',
    data,
  });
}

// 更新系统字典
export async function updateDict(data: any) {
  return await request(`/api/dict/${data.id}`, {
    method: 'PUT',
    data,
  });
}

// 删除系统字典
export async function deleteDict(params: { dictId: number }) {
  return await request(`/api/dict/${params.dictId}`, {
    method: 'DELETE',
  });
}

// 获取系统字典详情
export async function getDictDetail(id: string) {
  return await request(`/api/dict/${id}`, {
    method: 'GET',
  });
}

// 根据代码编号查询字典列表
export async function getDictsByCodeNo(codeNo: string) {
  return await request(`/api/dict/code/${codeNo}`, {
    method: 'GET',
  });
}

// 批量查询字典
export async function getDictsByCodeNoList(codeNoList: string[]) {
  return await request('/api/dict/batch', {
    method: 'POST',
    data: codeNoList,
  });
}

// 刷新字典数据
export async function refreshDicts() {
  return await request('/api/dict/refresh', {
    method: 'POST',
  });
}
