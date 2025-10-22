import { request } from '@umijs/max';

/** 双人复核测试接口 */
export async function reviewApi(data: any, reviewInfo: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/api/test-in`, {
    method: 'POST',
    headers: {
      ...reviewInfo,
    },
    data,
    ...(options || {}),
  });
}
