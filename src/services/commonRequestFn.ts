import { filterNullField } from '@/utils';
import { request } from '@umijs/max';

// 定义公共请求函数
export function commonRequestList(
  url: string,
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  // 校验并设置默认值
  const { current = 1, pageSize = 10, ...queryParams } = params || {};

  // 构造请求体
  const data = {
    pageInfo: {
      pageNo: current,
      pageSize,
    },
    filters: filterNullField(queryParams),
  };

  // 执行请求并捕获异常
  return request(url, {
    method: 'POST',
    data,
    ...(options || {}),
  }).catch((error) => {
    console.error(`Request to ${url} failed:`, error);
    throw new Error(`Failed to fetch address data: ${error.message}`);
  });
}
