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
/** 获取api资源列表 GET /system/interface/listPage */
export async function elList(
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
  return request<PhoenixAPI.ResourceList>('/system/webpage-element/page', {
    method: 'GET',
    params: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}
export async function apiList(
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
  return request<PhoenixAPI.ResourceList>('/system/interface/page', {
    method: 'GET',
    params: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}
/** 获取资源列表 GET /system/interface/listPage */
export async function sourceList(
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
  return request<PhoenixAPI.ResourceList>('/system/interface/page', {
    method: 'GET',
    params: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}

/** 编辑资源 POST /system/interface/update */
export async function updateApi(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/system/interface/${data.id}?ignoreNull=false`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
export async function updateEl(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/system/webpage-element/${data.id}?ignoreNull=false`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
/** 添加资源 POST /system/interface/create */
export async function addApi(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/interface', {
    method: 'POST',
    data: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}
/** 添加资源 POST /system/interface/create */
export async function addEl(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/webpage-element', {
    method: 'POST',
    data: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}
/** 删除规则 DELETE /phoenix/system/interface */
export async function removeApi(data: string[], options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/interface?operate=batch', {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}
export async function removeEl(data: string[], options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/webpage-element?operate=batch', {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}
