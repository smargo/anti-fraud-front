// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  console.log(options);

  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
/** 获取分类列表 GET /api/rule */
export async function categoryList(params = {}, options?: { [key: string]: any }) {
  return request<PhoenixAPI.CategoryList>('/security/resCategory/listAll', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
/** 获取资源列表 GET /api/rule */
export async function sourceList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options: { [key: string]: any },
) {
  // console.log(params, options);
  // let sorter: {
  //   orderBy: string,
  //   direction: 'ascend' | 'descend'
  // };
  // Object.keys(options).forEach(item => {
  //   sorter.orderBy = item,
  //   sorter.direction = 'ascend'
  // })
  const data = { ...params, pageNo: params.current };
  return request<API.ResourceListItem>('/security/resource/listPage', {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}

/** 编辑资源 POST /security/resource/update */
export async function updateSource(data: any, options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/security/resource/update', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
/** 添加资源 POST /security/resource/update */
export async function addSource(data: any, options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/security/resource/create', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
/** 删除资源 DELETE /api/rule */
export async function removeSource(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/security/resource/delete', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
