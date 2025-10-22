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
export async function userList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options: { [key: string]: any } = {},
) {
  // const data = { ...params, pageNo: params.current };
  console.log(params, options);
  // const exParams = {}

  // const keys = Object.keys(options)
  // keys.forEach((key: string) => {
  //   exParams[`sorts[0].orderBy`] = key;
  //   exParams[`sorts[0].direction`] = options[key] = 'ascend' ? 'ASC': 'DESC'
  // });

  const data = filterNullField({ ...params, pageNo: params.current });
  return request<PhoenixAPI.UserList>('/system/user/page', {
    method: 'GET',
    params: { ...data },
    ...(options || {}),
  });
}
/** 获取资源列表 GET /security/resource/listPage */
export async function userListPlus(params: {}, options?: { [key: string]: any }) {
  // const data = { ...params, pageNo: params.current };
  const data = filterNullField({ ...params });
  return request<PhoenixAPI.UserList>('/system/user/list', {
    method: 'GET',
    params: { ...data },
    ...(options || {}),
  });
}

/** 编辑资源 POST /security/resource/update */
export async function updateUser(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/system/user`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
/** 添加资源 POST /security/resource/create */
export async function addUser(data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/user', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
/** 删除规则 DELETE /phoenix/security/resource */
export async function removeSource(data: string[], options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/system/user?operate=batch`, {
    method: 'DELETE',
    data,
    ...(options || {}),
  });
}

/** 重置密码 POST /security/resource/update */
export async function resetPassword(id: string, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/system/user/${id}/reset-password`, {
    method: 'PUT',
    ...(options || {}),
  });
}
/** 解锁账户 POST /security/resource/update */
export async function releaseAccount(id: string, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/system/user/${id}/unlock`, {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 获取色有效时间 POST /security/resource/update */
export async function userRoleLifeTime(params: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/security/user-role-effective-time`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
// 设置用户角色有效时间
export async function updateUserRoleLifeTime(
  data: PhoenixAPI.UserRoleLifeTime,
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>(`/security/user-role-effective-time?ignoreNull=false`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
// 设置用户角色有效时间
export async function addUserRoleLifeTime(
  data: PhoenixAPI.UserRoleLifeTime,
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>(`/security/user-role-effective-time`, {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

// 用户组已关联的角色列表
export async function userGroupLinkUserList(
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
  return request<PhoenixAPI.UserLinkRoleList>(`/system/group-user-relation/page`, {
    method: 'GET',
    params: {
      appCode: APP_CODE,
      ...params,
    },
    ...(options || {}),
  });
}

/** 用户组关联用户 POST /security/resource/create */
export async function groupLinkUsers(data: any, groupId: string) {
  return request<Record<string, any>>(`/system/group-user-relation/replace`, {
    method: 'POST',
    params: {
      groupId: groupId,
      appCode: APP_CODE,
    },
    data,
    // ...(options || {}),
  });
}
