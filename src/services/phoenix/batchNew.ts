// @ts-ignore
/* eslint-disable */
import { filterNullField } from '@/utils';
import { request } from '@umijs/max';

/** 任务列表  */
export async function jobLists(
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
  return request<PhoenixAPI.BatchTaskListItem1[]>('/batch/job/list', {
    method: 'GET',
    params: {
      ...data,
    },
    ...(options || {}),
  });
}

/**
 * 实例列表
 */
export async function instanceList(
  params: {
    // query
    id?: string;
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options: { [key: string]: any },
) {
  const data = filterNullField({ ...params, pageNo: params.current });
  return request<PhoenixAPI.TaskInstanceItem[]>(`/batchNew/job/${params?.id}/instance/list`, {
    method: 'GET',
    params: {
      ...data,
    },
    ...(options || {}),
  });
}

// 实例执行列表
export async function instanceExcuteList(
  params: {
    // query
    id?: string;
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options: { [key: string]: any },
) {
  const data = filterNullField({ ...params, pageNo: params.current });
  // return request<PhoenixAPI.CategoryList>(`/batch/job/${params?.id}/instance/list`, {
  return request<PhoenixAPI.TaskInstanceExecutionItem[]>(
    `/batchNew/job/instance/${params?.id}/execution/list`,
    {
      method: 'GET',
      params: {
        ...data,
      },
      ...(options || {}),
    },
  );
}

// 实例步骤执行列表
export async function instanceExcuteStepList(
  params: {
    // query
    id?: string;
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options: { [key: string]: any },
) {
  const data = filterNullField({ ...params, pageNo: params.current });
  return request<PhoenixAPI.InstanceStep>(
    `/batchNew/job/instance/execution/${params.id}/step/list`,
    {
      method: 'GET',
      params: {
        ...data,
      },
      ...(options || {}),
    },
  );
}

// 获取启动参数
export async function runParams(id = '', serverName = '') {
  return request<PhoenixAPI.RunParamsList>(`/batchNew/job/${id}/launch-parameter-input`, {
    method: 'GET',
    params: {
      serverName: serverName,
    },
  });
}
// 执行实例
export async function runTask(
  name: string,
  serverName: string,
  data: Record<string, any> = {},
  options: Record<string, any> = {},
) {
  return request<PhoenixAPI.NoResultRespones>(`/batchNew/job/${name}/launch/${serverName}`, {
    method: 'POST',
    data: data,
    options,
  });
}

// 重启任务
export async function restartTask(
  id: number,
  serverName: string,
  options: Record<string, any> = {},
) {
  return request<PhoenixAPI.NoResultRespones>(
    `/batchNew/job/instance/execution/${id}/restart/${serverName}`,
    {
      method: 'GET',
      // data: data,
      options,
    },
  );
}

// 丢弃任务
export async function dropTask(id: number, serverName: string, options: Record<string, any> = {}) {
  return request<PhoenixAPI.NoResultRespones>(
    `/batchNew/job/instance/execution/${id}/abandon/${serverName}`,
    {
      method: 'GET',
      // data: data,
      options,
    },
  );
}

// 停止任务
export async function stopTask(id: number, options: Record<string, any> = {}) {
  return request<PhoenixAPI.NoResultRespones>(`/batchNew/job/instance/execution/${id}/stop`, {
    method: 'GET',
    // data: data,
    options,
  });
}
