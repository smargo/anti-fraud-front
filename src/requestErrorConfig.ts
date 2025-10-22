import type { RequestOptions } from '@@/plugin-request/request';
// import type { RequestConfig } from '@umijs/max';
import { history, RequestConfig } from '@umijs/max';
import { notification } from 'antd';
import { stringify } from 'querystring';
import userPortMap from '../config/userPortMap';
import { isDev, isJSON, resetModelState } from './utils';
import { MessageUtils } from './utils/messageUtils';
// const { initialState } = useModel('@@initialState');
// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: {
    /** 状态码: 0-成功，非0-失败 */
    code: string;
    /** 数据 */
    data: any;
    /** 消息 */
    message: string;
    [key: string]: any;
  };
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}
enum ErrorCode {
  UN_LOGIN = '1000006',
  PASSWORD_EXPIRED = '1000007',
}
enum Path {
  LOGIN = '/user/login',
  CHANGE_PASSWORD = '/user/password',
}

const goBackLogin = () => {
  const { search, pathname } = window.location;
  // resetModelState();
  if (pathname !== Path.LOGIN) {
    history.replace({
      pathname: Path.LOGIN,
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
};
const messageBlobError = async (data: Blob) => {
  const text = await data.text();
  if (isJSON(text)) {
    MessageUtils.error(JSON.parse(text).message);
  } else {
    MessageUtils.error(`无法处理此错误: ${data}`);
    console.log('无法处理此错误', data);
  }
};

// token失效传给统一门户
const handleToPortal = () => {
  // 发送消息
  const params = {
    type: 'loseToken',
    data: true,
  };
  window.top?.postMessage(params, '*');
};

/**
 * 处理API响应错误
 * @param response - axios响应对象
 * @param data - 响应数据
 * @param isDev - 是否为开发环境
 */
const handleApiError = (response: any, data: any, isDev: boolean): void => {
  // 获取请求URL用于日志记录
  const requestUrl = response?.config?.url || '未知URL';
  const errorCode = data.code;
  const errorMessage = data.message || '未知错误';

  // 记录详细的错误日志到控制台
  console.error('API响应错误详情:', {
    code: errorCode,
    message: errorMessage,
    timestamp: new Date().toISOString(),
    requestMethod: response?.config?.method || '未知',
    url: requestUrl,
    status: response?.status || '未知',
    fullResponse: data,
  });

  // 开发环境下提供更详细的调试信息
  if (isDev) {
    console.group('🔍 开发环境调试信息');
    console.log('请求配置:', response?.config);
    console.log('响应头:', response?.headers);
    console.log('完整响应数据:', response);
    console.groupEnd();
  }

  // 根据错误码分类处理，提供更友好的用户提示
  let userFriendlyMessage = errorMessage;

  // 常见错误码的友好提示
  switch (errorCode) {
    case '1':
      userFriendlyMessage = '参数不存在';
      break;
    case '2':
      userFriendlyMessage = '无效的参数';
      break;
    case '11':
      userFriendlyMessage = '数据不存在';
      break;
    case '12':
      userFriendlyMessage = '数据已存在';
      break;
    case '21':
      userFriendlyMessage = '远程服务调用异常';
      break;
    case '1000006':
      userFriendlyMessage = '登录已过期，请重新登录';
      break;
    case '1000007':
      userFriendlyMessage = '密码已过期，请修改密码';
      break;
    default:
      // 对于未知错误码，保留原始消息或提供通用提示
      userFriendlyMessage = errorMessage || `操作失败（错误码：${errorCode}）`;
  }

  // 显示用户友好的错误提示
  MessageUtils.error(`服务请求失败: ${userFriendlyMessage}`);
};

/**
 * 处理网络错误，提供用户友好的错误提示
 * @param error - 错误对象
 * @returns void
 */
const handleNetworkError = (error: any): void => {
  // 记录详细的网络错误信息
  console.error('网络请求错误详情:', {
    code: error.code,
    message: error.message,
    timestamp: new Date().toISOString(),
    method: error.config?.method || '未知',
    url: error.config?.url || '未知URL',
    request: error.request,
  });

  // 根据错误类型提供友好的用户提示
  if (error.code === 'ECONNABORTED') {
    MessageUtils.error('请求超时，请检查网络连接后重试');
  } else if (error.message?.includes('Network Error')) {
    MessageUtils.error('网络连接失败，请检查网络设置');
  } else if (error.message?.includes('timeout')) {
    MessageUtils.error('请求超时，服务器响应缓慢');
  } else if (error.message?.includes('ERR_NETWORK')) {
    MessageUtils.error('网络连接异常，请检查网络状态');
  } else if (error.message?.includes('ERR_INTERNET_DISCONNECTED')) {
    MessageUtils.error('网络连接已断开，请检查网络连接');
  } else if (error.message?.includes('ERR_CONNECTION_REFUSED')) {
    MessageUtils.error('连接被拒绝，服务器可能不可用');
  } else {
    MessageUtils.error('网络请求失败，请稍后重试');
  }
};

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  baseURL: window.__POWERED_BY_QIANKUN__ ? window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ : '',
  // baseURL: '/ccs',
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      console.log(res, 3333);

      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = {
          errorCode,
          errorMessage: errorMessage || res?.message,
          showType,
          data,
          code: res?.code,
          message: res?.message,
        };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    // eslint-disable-next-line complexity
    errorHandler: (error: any, opts: any) => {
      console.log(error.info);
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              MessageUtils.warning(errorMessage || '警告');
              break;
            case ErrorShowType.ERROR_MESSAGE:
              MessageUtils.error(errorMessage || '错误');
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              console.log(errorMessage);
              MessageUtils.error(errorMessage || '未知错误');
          }
        }
      } else if (error.response) {
        const { data } = error.response;

        // 检查是否为网络错误（状态码为0）
        if (error.response.status === 0) {
          // 将网络错误转到 error.request 分支处理
          handleNetworkError(error);
          return;
        }

        if (data) {
          if (data instanceof Blob) {
            messageBlobError(data);
          }
          switch (data.code) {
            case ErrorCode.UN_LOGIN:
              MessageUtils.error(data.message);
              // goBackLogin();
              resetModelState();
              handleToPortal();
              break;
            case ErrorCode.PASSWORD_EXPIRED:
              MessageUtils.error(data.message);
              history.replace({
                pathname: Path.CHANGE_PASSWORD,
              });
              break;
            default:
              console.error(data.message ?? error.message);
              MessageUtils.error(data.message ?? error.message);
          }
        }
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例

        // 使用统一的网络错误处理函数
        handleNetworkError(error);
      } else {
        // 发送请求时出了点问题
        console.error('请求错误:', {
          message: error.message,
          config: error.config,
          timestamp: new Date().toISOString(),
        });
        MessageUtils.error('请求错误，请稍后重试');
      }
    },
  },
  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 添加请求头 token
      const authToken = localStorage.getItem('x-auth-token') as string;
      if (authToken) {
        config.headers = { ...config.headers, 'X-Auth-Token': authToken };
      }
      return config;
    },
    (config: RequestOptions) => {
      const useMock = process.env.MOCK === '1';
      if (useMock) {
        // 使用 mock 数据
        return config;
      } else if (API_SERVER === 'http://admin.com') {
        // 本地调试直接使用 ip 调用接口时不执行端口映射逻辑
        if (isDev) {
          const [user] = window.location.hostname.split('.');
          let port = (userPortMap as Record<string, string>)[user];

          if (!port && /^\d+$/.test(user)) {
            // 兼容动态端口配置
            port = user;
          }

          if (!port) {
            // throw new Error('请联系【前端组】提供端口号');
            MessageUtils.error('暂无当前用户端口映射，请联系【前端组】提供个人测试环境端口号');
            return Promise.reject('暂无当前用户端口映射，请联系【前端组】提供个人测试环境端口号');
          } else {
            config.url = `${API_SERVER}:${port}${config.url}`;
          }
        }
      } else {
        config.url = API_SERVER + config.url;
      }

      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    // eslint-disable-next-line complexity
    (response) => {
      if (response?.headers?.['x-auth-token']) {
        // sessionStorage.setItem('x-auth-token', response?.headers?.['x-auth-token']);
        localStorage.setItem('x-auth-token', response?.headers?.['x-auth-token']);
      }
      const { data } = response as unknown as ResponseStructure;
      if (data.success === true) {
        return response;
      }
      if (data.success === false) {
        MessageUtils.error('请求失败！');
        return response;
      }
      // 判断是否直接返回文件流
      if (data instanceof Blob || data instanceof ArrayBuffer) {
        return response;
      }

      /** 账号在其他地方登录 */
      const isMultipleLogin =
        (data as unknown as string) ===
        'This session has been expired (possibly due to multiple concurrent logins being attempted as the same user).';

      // 我们公司的响应体改造 适配正常接口
      if (data?.code === '6' || data?.code === '7' || isMultipleLogin) {
        const { search, pathname } = window.location;
        resetModelState();
        handleToPortal();
        // let msg = data?.code === '7' ? '密码已过期，请修改密码!' : '登录已经过期, 请重新登录！';

        // if (isMultipleLogin) {
        //   msg = '当前账号在其他地方登录';
        // }

        // message.error(msg);
        // if (pathname !== '/user/login') {
        //   history.replace({
        //     pathname: '/user/login',
        //     search: stringify({
        //       redirect: pathname + search,
        //     }),
        //   });
        // }

        return response;
      }
      // 审批流情况
      if (data.order || data.processDefinitionId || Array.isArray(data)) {
        data.success = true;
        return response;
      }
      if (!data) {
        return response;
      }

      if (data.code !== '0') {
        handleApiError(response, data, isDev);
        // 标记为失败状态
        data.success = false;
        return response;
      }
      // table页面
      if (data?.data?.pageNo || data?.data?.page) {
        data.current = data.data.pageNo;
        data.total = data.data.totalElements || data.data.totalCount;
        data.data = data?.data?.result || data?.data;
        if (!Array.isArray(data.data)) {
          data.data = [];
        }
      }
      data.success = true;
      return response;
    },
  ],
};
