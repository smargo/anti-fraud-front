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
export async function loginLogList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options: { [key: string]: any },
) {
  // const data = { ...params, pageNo: params.current };
  // filterNullField
  const data = filterNullField({ ...params, pageNo: params.current });
  return request<PhoenixAPI.LoginLogList>('/system/login-record/page', {
    method: 'GET',
    params: { ...data },
    ...(options || {}),
  });
}

/** 编辑资源 POST /security/resource/update */
export async function updateSource(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/security/resource/${data.id}?ignoreNull=false`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
/** 添加资源 POST /security/resource/create */
export async function addSource(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/security/resource', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
/** 删除规则 DELETE /phoenix/security/resource */
export async function removeSource(data: string[], options?: { [key: string]: any }) {
  return request<Record<string, any>>('/security/resource', {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}
