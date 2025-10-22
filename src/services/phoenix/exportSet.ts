// @ts-ignore
/* eslint-disable */
import { filterNullField } from '@/utils';
import { request } from '@umijs/max';

/** 获取分类列表 GET /security/resCategory/listAll */
export async function categoryList(params = {}, options?: { [key: string]: any }) {
  return request<PhoenixAPI.ExportSetList>('/security/resCategory/listAll', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
/** 获取资源列表 GET /security/resource/listPage */
export async function exportSetList(
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
  return request<PhoenixAPI.ExportSetList>('/exporter/template/page', {
    method: 'GET',
    params: { ...data },
    ...(options || {}),
  });
}

/** 更新导出模板 POST */
export async function updateExportSet(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/exporter/template/${data.id}?ignoreNull=false`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

// /** 导出模板详情 POST */
// export async function exportSetDetail(data: any, options?: { [key: string]: any }) {
//   return request<Record<string, any>>(`/exporter/template/${data.id}`, {
//     method: 'PUT',
//     data,
//     ...(options || {}),
//   });
// }

/** 新建导出模板 POST */
export async function addExportSet(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/exporter/template', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** 删除规则 DELETE /phoenix/security/resource */
export async function removeExportSet(data: string[], options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/exporter/template?operate=batch`, {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}

/** 导出配置详情 DELETE /phoenix/security/resource */
export async function exportSetDetail(id: string, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/exporter/template/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}
