// @ts-ignore
/* eslint-disable */
import { filterNullField } from '@/utils';
import { request } from '@umijs/max';
declare const APP_CODE: string;

/** 获取分类列表 GET /security/resCategory/listAll */
export async function categoryList(params = {}, options?: { [key: string]: any }) {
  return request<PhoenixAPI.CategoryList>('/security/resCategory/listAll', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取资源列表 GET /security/resource/listPage */
export async function roleList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  // const data = { ...params, pageNo: params.current };
  const data = filterNullField({ ...params, pageNo: params.current });
  return request<PhoenixAPI.RoleList>('/system/role/page', {
    method: 'GET',
    params: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}
// 不分页角色列表
export async function roleListPlus(params: {}, options?: { [key: string]: any }) {
  // const data = { ...params, pageNo: params.current };
  const data = filterNullField({ ...params });
  return request<PhoenixAPI.RoleList>('/system/role/list', {
    method: 'GET',
    params: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}
// 用户已关联的角色列表
export async function userLinkRoleList(id: string, options?: { [key: string]: any }) {
  return request<PhoenixAPI.UserLinkRoleList>(`/system/user-role-relation/list?id.userId=${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}
// 用户已关联的角色列表
export async function userLinkRoleList1(params: any, options?: { [key: string]: any }) {
  return request<PhoenixAPI.UserLinkRoleList>(`/system/user-role-relation/list`, {
    method: 'GET',
    params: params,
    ...(options || {}),
  });
}

/** 用户关联角色 POST /security/resource/create */
export async function userLinkRoles(data: any, userId: string) {
  return request<Record<string, any>>(`/system/user-role-relation/replace?userId=${userId}`, {
    method: 'POST',
    data,
    // ...(options || {}),
  });
}

// 用户组已关联的角色列表
export async function userGroupLinkRoleList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
    groupId: string;
  },
  options?: { [key: string]: any },
) {
  return request<PhoenixAPI.UserLinkRoleList>(`/system/group-role-relation/page`, {
    method: 'GET',
    params: {
      appCode: APP_CODE,
      ...params,
    },
    ...(options || {}),
  });
}

/** 用户关联角色 POST /security/resource/create */
export async function groupLinkRoles(data: any, groupId: string) {
  return request<Record<string, any>>(`/system/group-role-relation/replace`, {
    method: 'POST',
    params: {
      groupId: groupId,
      appCode: APP_CODE,
    },
    data,
    // ...(options || {}),
  });
}

/** 角色详情 POST /security/resource/update */
export async function roleInfo(id: any, options?: { [key: string]: any }) {
  return request<{ data: PhoenixAPI.RoleDetail }>(`/system/role/${id}`, {
    method: 'GET',
    // params,
    ...(options || {}),
  });
}

/** 编辑资源 POST /security/resource/update */
export async function updateRole(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/system/role/${data.id}?ignoreNull=false`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
/** 添加资源 POST /security/resource/create */
export async function addRole(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/role', {
    method: 'POST',
    data: {
      appCode: APP_CODE,
      ...data,
    },
    ...(options || {}),
  });
}
/** 删除规则 DELETE /phoenix/security/resource */
export async function removeRole(data: string[], options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/role?operate=batch', {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}

/** 角色关联权限关 POST /security/resource/create */
export async function roleLinkAuth(roleId: string, data: any) {
  return request<Record<string, any>>(`/system/role-permission-relation/replace`, {
    method: 'POST',
    params: {
      appCode: APP_CODE,
      roleId,
    },
    data,
    // ...(options || {}),
  });
}

// 角色已关联权限表
export async function roleLinkAuthList(id: string, options?: { [key: string]: any }) {
  return request<PhoenixAPI.RoleLinkAuthList>(
    `/system/role-permission-relation/list?roleId=${id}`,
    {
      method: 'GET',

      ...(options || {}),
    },
  );
}

/** 用户角色时效设置 POST /security/resource/create */
export async function userRoleTime(params: any) {
  return request<Record<string, any>>(`/system/user-role-relation`, {
    method: 'PUT',
    data: {
      appCode: APP_CODE,
      ...params,
    },
    // ...(options || {}),
  });
}
/** 用户角色时效设置 POST /security/resource/create */
export async function userGroupRoleTime(params: any) {
  return request<Record<string, any>>(`/system/group-role-relation`, {
    method: 'PUT',
    data: {
      appCode: APP_CODE,
      ...params,
    },
    // ...(options || {}),
  });
}
