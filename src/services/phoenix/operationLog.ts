// @ts-ignore
/* eslint-disable */
import { filterNullField } from '@/utils';
import { request } from '@umijs/max';
declare const APP_CODE: string;

/** 获取资源列表 GET /security/resource/listPage */
export async function operationLogList(
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
  return request<PhoenixAPI.OperationLogList>('/system/operation-log/page', {
    method: 'GET',
    params: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}
