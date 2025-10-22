import { request } from '@umijs/max';

/** 获取定时任务 GET /scheduler/task/list */
export async function timeTaskList(params: Record<string, any>, options?: { [key: string]: any }) {
  return request<PhoenixAPI.TimeTaskList>('/scheduler/task/list', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 开启关闭任务 POST /security/resource/create */
export async function changeTaskShortCircuit(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(
    `/scheduler/task/${data.name}/short-circuit/${!data.shortCircuit}`,
    {
      method: 'POST',
      // data,
      ...(options || {}),
    },
  );
}
