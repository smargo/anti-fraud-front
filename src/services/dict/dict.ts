import { SystemDictItem } from '@/pages/SystemDictList/types';
import { ApiResponse, ResultPage } from '@/types';
import { DictDataMap } from '@/types/dict';
import { request } from '@umijs/max';

// 查询系统字典列表
export async function queryDicts(params?: any): Promise<ResultPage<SystemDictItem>> {
  return await request('/api/dict/list', {
    method: 'GET',
    params,
  });
}

// 创建系统字典
export async function createDict(data: any): Promise<ApiResponse<boolean>> {
  return await request('/api/dict', {
    method: 'POST',
    data,
  });
}

// 更新系统字典
export async function updateDict(data: any): Promise<ApiResponse<boolean>> {
  return await request(`/api/dict/${data.id}`, {
    method: 'PUT',
    data,
  });
}

// 删除系统字典
export async function deleteDict(params: { dictId: number }): Promise<ApiResponse<boolean>> {
  return await request(`/api/dict/${params.dictId}`, {
    method: 'DELETE',
  });
}

// 根据代码编号查询字典列表
export async function getDictsByCodeNo(codeNo: string): Promise<ApiResponse<SystemDictItem[]>> {
  return await request(`/api/dict/code/${codeNo}`, {
    method: 'GET',
  });
}

// 批量查询字典
export async function getDictsByCodeNoList(
  codeNoList: string[],
): Promise<ApiResponse<DictDataMap>> {
  return await request('/api/dict/batch', {
    method: 'POST',
    data: codeNoList,
  });
}

// 刷新字典数据
export async function refreshDicts(): Promise<ApiResponse<string>> {
  return await request('/api/dict/refresh', {
    method: 'POST',
  });
}
