import { request } from '@umijs/max';

/** 获取分类列表 GET /security/resCategory/listAll */
export async function exportModel(
  url: string,
  params?: Record<string, any>,
  data: Record<string, any> = {},
  options?: { [key: string]: any },
) {
  return request(url, {
    method: 'GET',
    params: {
      ...params,
    },
    data,
    responseType: 'blob',
    ...(options || {}),
  });
}
export async function uploadFile(
  url: string,
  params: Record<string, any> = {},
  data: Record<string, any> = {},
  options?: { [key: string]: any },
) {
  return request(url, {
    method: 'POST',
    params: {
      ...params,
    },
    data,
    headers: { 'Content-Type': 'multipart/form-data;boundary=1;charset=utf-8' },
    ...(options || {}),
  });
}
// export async function importOrderLogistics(data: any) {
//   return request('/order/importOrderLogistics', {
//   method: 'POST',
//   data,
//   headers: { 'Content-Type': 'multipart/form-data;boundary=1;charset=utf-8' },
//   });
//   }
