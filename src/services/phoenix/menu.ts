// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
declare const APP_CODE: string;

/** 获取菜单列表 GET /security/resCategory/listAll */
export async function menuTreeList(params = {}, options?: { [key: string]: any }) {
  return request<PhoenixAPI.MenuTreeList>('/system/menu/list', {
    method: 'GET',
    params: {
      appCode: APP_CODE,
      ...params,
    },
    ...(options || {}),
  });
}
/** 菜单树 GET /security/resCategory/listAll */
export async function menuTree(params = {}, options?: { [key: string]: any }) {
  return request<PhoenixAPI.MenuTreeList>('/system/menu/tree', {
    method: 'GET',
    params: {
      appCode: APP_CODE,
      ...params,
    },
    ...(options || {}),
  });
}

/** 编辑菜单 POST /security/resource/update */
export async function updateMenu(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/system/menu?ignoreNull=false`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
/** 添加菜单 POST */
export async function addMenu(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/menu', {
    method: 'POST',
    data: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}
/** 删除菜单 DELETE /phoenix/security/resource */
export async function delMenu(data: Record<string, any>, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/system/menu/${data.id}`, {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}
