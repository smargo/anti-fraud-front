import { request } from '@umijs/max';

/** 服务列表 GET /security/resource/update */
export async function servicesList(options?: { [key: string]: any }) {
  return request<{ data: PhoenixAPI.ServicesListItem[] }>(`/remoting-console/application`, {
    method: 'GET',
    // params,
    ...(options || {}),
  });
}

/** 主机列表 GET /security/resource/update */
export async function hostList(hostName: string, options?: { [key: string]: any }) {
  return request<{ data: Array<string> }>(`/remoting-console/${hostName}/host`, {
    method: 'GET',
    // params,
    ...(options || {}),
  });
}
/** 方法列表 GET /security/resource/update */
export async function methodList(hostName: string, options?: { [key: string]: any }) {
  return request<{ data: PhoenixAPI.MethodsListItem[] }>(`/remoting-console/${hostName}/method`, {
    method: 'GET',
    // params,
    ...(options || {}),
  });
}
/** 调试方法 GET /security/resource/update */
export async function invokMethod(hostName: string, data: any, options?: { [key: string]: any }) {
  return request<PhoenixAPI.Response>(`/remoting-console/${hostName}/invoke`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
