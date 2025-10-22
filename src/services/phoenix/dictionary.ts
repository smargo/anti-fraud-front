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
export async function dictionaryList(
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
  return request<PhoenixAPI.DictionaryList>('/system/dictionary/page', {
    method: 'GET',
    params: { ...data },
    ...(options || {}),
  });
}

/** 编辑字典 POST /security/resource/update */
export async function updateDictionary(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/system/dictionary/${data.id}?ignoreNull=false`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
/** 添加字典 POST /security/resource/create */
export async function addDictionary(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/dictionary', {
    method: 'POST',
    data: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}
/** 删除字典 DELETE /phoenix/security/resource */
export async function removeDictionary(data: string[], options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/dictionary?operate=batch', {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}

/** 获取字典详情 POST /security/resource/create */
export async function dictionaryInfo(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/dictionary/item', {
    method: 'GET',
    params: {
      ...data,
    },
    ...(options || {}),
  });
}
