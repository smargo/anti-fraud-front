// @ts-ignore
/* eslint-disable */
import { isDev } from '@/utils';
import { request } from '@umijs/max';
declare const API_SERVER: string;

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ...body,
      password: window.btoa(body.password as string),
    },

    ...(options || {}),
  });
}

/** 新登录接口 POST /api/login/account */
export async function loginApi(params: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // 'Content-Type': 'application/json',
    },
    params,
    ...(options || {}),
  });
}
export async function oauth2Api(options?: { [key: string]: any }) {
  const params = {
    response_type: 'code',
    client_id: isDev ? 'messaging-client' : 'messaging-client-bbit',
    scope: 'message.read',
    redirect_uri: `${location.origin}${API_SERVER}/api/authorized`,
    // http://127.0.0.1:8081/api/authorized
  };
  return request('/oauth2/authorize', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    params,
    ...(options || {}),
  });
}
export async function fetchTokenApi(code: string, options?: { [key: string]: any }) {
  const tmpData = {
    redirect_uri: `${location.origin}${API_SERVER}/api/authorized`,
    grant_type: 'authorization_code',
    code,
  };
  const params = tmpData;
  // const params = qs.stringify(tmpData);
  return request('/oauth2/authorize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: isDev
        ? 'basic bWVzc2FnaW5nLWNsaWVudDpzZWNyZXQ='
        : 'basic bWVzc2FnaW5nLWNsaWVudC1iYml0OnNlY3JldA==',
    },
    params,
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: PhoenixAPI.CurrentUser;
  }>('/security/user/self', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentSelf(params: { appCode: string }, options?: { [key: string]: any }) {
  return request<{
    data: PhoenixAPI.CurrentUser;
  }>('/system/user/self/auth', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 获取获取二维码链接 GET /api/currentUser */
export async function qrcodeUrl(options?: { [key: string]: any }) {
  return request<{
    data: PhoenixAPI.Qrcode;
  }>('/api/qrcode/genQrcode', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取获取二维码状态 GET /api/currentUser */
export async function qrcodeStatus(params: { qrcode: string }, options?: { [key: string]: any }) {
  return request<{
    data: PhoenixAPI.Qrcode;
  }>('/api/qrcode/queryQrcode', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 获取获取二维码链接 GET /api/currentUser */
export async function loginConfigData(options?: { [key: string]: any }) {
  return request<{
    data: PhoenixAPI.LoginConfigData;
  }>('/api/login/config', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取菜单接口 POST /logout */
export async function menuData(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/security/menu/listMeVisibleMenuTree', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 发送验证码 POST /api/login/captcha */
export async function getCaptcha(
  params: {
    // query
    /** 手机号 */
    username?: string;
    type?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptcha>('/api/captcha/sms?', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function changePassword(params: any, data: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/system/user/change-password', {
    method: 'PUT',
    params,
    data,
    ...(options || {}),
  });
}

/** 登录接口OA */
export async function oaLogin(data: any) {
  return request('/login?type=sso&target=oa-sso', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  });
}
