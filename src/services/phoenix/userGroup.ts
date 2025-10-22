// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
declare const APP_CODE: string;

/** 用户组树 GET /security/resCategory/listAll */
export async function userGroupTree(params = {}, options?: { [key: string]: any }) {
  return request<PhoenixAPI.MenuTreeList>('/system/group/tree', {
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
  return request<Record<string, any>>(`/system/group?ignoreNull=false`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
/** 添加菜单 POST */
export async function addMenu(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/group', {
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
  return request<Record<string, any>>(`/system/group/${data.id}`, {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}

// 用户已关联的角色列表
export async function userGroupLinkRoleList1(params: any, options?: { [key: string]: any }) {
  return request<PhoenixAPI.UserLinkRoleList>(`/system/group-role-relation/list`, {
    method: 'GET',
    params: {
      appCode: APP_CODE,
      ...params,
    },
    ...(options || {}),
  });
}
