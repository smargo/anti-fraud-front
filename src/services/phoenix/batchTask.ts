// @ts-ignore
/* eslint-disable */
import { filterNullField } from '@/utils';
import { request } from '@umijs/max';

/** 获取分类列表 GET /security/resCategory/listAll */
export async function categoryList(params = {}, options?: { [key: string]: any }) {
  return request<PhoenixAPI.CategoryList>('/security/resCategory/listAll', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
/** 获取资源列表 GET /security/resource/listPage */
export async function batchTaskList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options: { [key: string]: any },
) {
  const data = filterNullField({ ...params, pageNo: params.current });
  return request<PhoenixAPI.BatchTaskList>('/phoenix/batch/instance/page', {
    method: 'GET',
    params: { ...data },
    ...(options || {}),
  });
}
/** 任务明细 GET /security/resource/listPage */
export async function detailList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options: { [key: string]: any },
) {
  const data = { ...params, pageNo: params.current };
  return request<PhoenixAPI.BatchTaskList>('/phoenix/batch/item/page', {
    method: 'GET',
    params: { ...data },
    ...(options || {}),
  });
}

/** 下载批量任务文件 GET /security/resource/update */
export async function downLoadTaskFile(id: string, options?: { [key: string]: any }) {
  return request<Blob>(`/phoenix/batch/instance/${id}/export-batch-file`, {
    method: 'GET',
    responseType: 'blob',
  });
}

/** 添加批量任务 POST /security/resource/create */
export async function addBatchTask(
  data: any,
  options?: {
    headers?: { 'Content-Type': 'multipart/form-data' };
  },
) {
  return request<Record<string, any>>('/phoenix/batch/instance/upload', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
/** 删除规则 DELETE /phoenix/security/resource */
export async function removeBatchTask(data: string[], options?: { [key: string]: any }) {
  return request<Record<string, any>>('/phoenix/batch/instance?operate=batch', {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}
