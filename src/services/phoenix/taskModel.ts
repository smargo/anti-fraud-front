// @ts-ignore
/* eslint-disable */
import { filterNullField } from '@/utils';
import { request } from '@umijs/max';

/** 获取分类列表 GET /security/resCategory/listAll */
export async function taskModelDetail(id: string, options?: { [key: string]: any }) {
  return request<{ data: PhoenixAPI.TaskModelListItem }>(`/phoenix/batch/task/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}
/** 获取资源列表 GET /security/resource/listPage */
export async function taskModelList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const data = filterNullField({ ...params, pageNo: params.current });
  return request<PhoenixAPI.TaskModelList>('/phoenix/batch/task/page', {
    method: 'GET',
    params: { ...data },
    ...(options || {}),
  });
}

/** 编辑任务模板 POST /security/resource/update */
export async function updateTaskModel(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/phoenix/batch/task/${data.id}?ignoreNull=false`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
/** 添加任务模板 POST /security/resource/create */
export async function addTaskModel(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/phoenix/batch/task', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
/** 删除任务模板 DELETE /phoenix/security/resource */
export async function removeTaskModel(data: string[], options?: { [key: string]: any }) {
  return request<Record<string, any>>('/phoenix/batch/task?operate=batch', {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}

// 下载批量模板文件
export async function downLoadTaskModelFile(id: string, options?: { [key: string]: any }) {
  return request<Blob>(`/phoenix/batch/task/${id}/export-file-template`, {
    method: 'GET',
    // params,
    ...(options || { responseType: 'blob' }),
  });
}
