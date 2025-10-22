// @ts-ignore
/* eslint-disable */
import { filterNullField } from '@/utils';
import { request } from '@umijs/max';

/** 获取分类列表 GET /security/resCategory/listAll */
export async function categoryList(params = {}, options?: { [key: string]: any }) {
  return request<PhoenixAPI.CategoryList>(
    // '/security/resCategory/listAll',
    '/security/resource-category/list',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 获取分类列表 GET /security/resCategory/listAll */
export async function categoryWithSourceList(params = {}, options?: { [key: string]: any }) {
  return request<PhoenixAPI.CategoryList>(
    // '/security/resCategory/listAll',
    '/security/resource-category/all',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 获取资源列表 分页 GET  */
export async function categoryLists(
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
  return request<PhoenixAPI.CategoryList>('/security/resource-category/page', {
    method: 'GET',
    params: {
      ...data,
    },
    ...(options || {}),
  });
}

/** 编辑资源分类 POST /security/resource/update */
export async function updateCategory(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/security/resource-category/${data.id}?ignoreNull=false`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
/** 添加资源 POST /security/resource/create */
export async function addCategory(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/security/resource-category', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
/** 删除规则 DELETE /phoenix/security/resource */
export async function removeCategory(data: string[], options?: { [key: string]: any }) {
  return request<Record<string, any>>('/security/resource-category?operate=batch', {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}
