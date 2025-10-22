import { request } from '@umijs/max';

/** 上传文件到阿里云OSS: http://100.69.37.7:3000/project/115/interface/api/17679 */
export async function uploadFile(
  data: any,
  options?: {
    options?: {
      headers?: { 'Content-Type': 'multipart/form-data' };
      timeout: 5000;
    };
  },
) {
  return request<Record<string, any>>('/ccs-admin/file/oss/upload', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** 老核心下载 */
export async function downloadFile(
  data: {
    path: string;
    newFlag?: boolean;
    /** 预览或下载，接口根据该字段决定返回文件预览还是返回流下载 */
    viewFlag?: boolean;
  },
  options?: { [key: string]: any },
) {
  // return request<Record<string, any>>('/ccs-admin/file/oss/download', {
  //   method: 'POST',
  //   data,
  //   ...(options || {}),
  // });
  return request<Record<string, any>>(`/ccs-admin/file/oss/download`, {
    method: 'GET',
    params: data,
    ...(options || {}),
  });
}
