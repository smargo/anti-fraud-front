// @ts-ignore
/* eslint-disable */
import { filterNullField } from '@/utils';
import { request } from '@umijs/max';
declare const APP_CODE: string;

/** 获取参数列表 GET /security/resource/listPage */
export async function parameterList(
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
  const data = filterNullField({ ...params, pageNo: params.current });
  return request<PhoenixAPI.ParameterList>('/system/parameter/page', {
    method: 'GET',
    params: { ...data },
    ...(options || {}),
  });
}

/** 更新参数 POST /security/resource/update */
export async function updateParameter(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/system/parameter/${data.id}?ignoreNull=false`, {
    method: 'PUT',
    data: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}
/** 添加参数 POST /security/resource/create */
export async function addParameter(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/parameter', {
    method: 'POST',
    data: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}
/** 删除参数 DELETE /phoenix/security/resource */
export async function removeParameter(data: string[], options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/parameter?operate=batch', {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}
