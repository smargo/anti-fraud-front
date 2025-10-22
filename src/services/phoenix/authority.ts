// @ts-ignore
/* eslint-disable */
import { filterNullField } from '@/utils';
import { request } from '@umijs/max';
declare const APP_CODE: string;

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
export async function authortyList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  // const data = { ...params, pageNo: params.current };
  const data = filterNullField({ ...params, pageNo: params.current });
  return request<PhoenixAPI.AuthorityList>('/system/permission/page', {
    method: 'GET',
    params: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}

// 权限列表 不分页
export async function authortyListPlus(params = {}, options?: { [key: string]: any }) {
  // const data = { ...params, pageNo: params.current };
  const data = filterNullField({ ...params });
  return request<PhoenixAPI.AuthorityList>('/system/permission/list', {
    method: 'GET',
    params: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}

/** 编辑资源 POST /security/resource/update */
export async function updateRole(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/system/permission/${data.id}?ignoreNull=false`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
/** 添加资源 POST /security/resource/create */
export async function addRole(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/permission', {
    method: 'POST',
    data: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}
/** 删除规则 DELETE /phoenix/security/resource */
export async function removeRole(data: string[], options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/permission?operate=batch', {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}
