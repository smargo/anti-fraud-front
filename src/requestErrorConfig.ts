import { notification, message } from 'antd';
import { stringify } from 'querystring';
import { history } from 'umi';

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
    code: string;
    data: any;
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
  try {
    const jsonData = JSON.parse(text);
    message.error(jsonData.message || '请求失败');
  } catch {
    message.error(`无法处理此错误: ${data}`);
    console.log('无法处理此错误', data);
  }
};

const handleApiError = (response: any, data: any): void => {
  const requestUrl = response?.config?.url || '未知URL';
  const errorCode = data.code;
  const errorMessage = data.message || '未知错误';

  console.error('API响应错误详情:', {
    code: errorCode,
    message: errorMessage,
    timestamp: new Date().toISOString(),
    requestMethod: response?.config?.method || '未知',
    url: requestUrl,
    status: response?.status || '未知',
    fullResponse: data,
  });

  let userFriendlyMessage = errorMessage;
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
      userFriendlyMessage = errorMessage || `操作失败（错误码：${errorCode}）`;
  }
  message.error(`服务请求失败: ${userFriendlyMessage}`);
};

const handleNetworkError = (error: any): void => {
  console.error('网络请求错误详情:', {
    code: error.code,
    message: error.message,
    timestamp: new Date().toISOString(),
    method: error.config?.method || '未知',
    url: error.config?.url || '未知URL',
    request: error.request,
  });

  if (error.code === 'ECONNABORTED') {
    message.error('请求超时，请检查网络连接后重试');
  } else if (error.message?.includes('Network Error')) {
    message.error('网络连接失败，请检查网络设置');
  } else if (error.message?.includes('timeout')) {
    message.error('请求超时，服务器响应缓慢');
  } else if (error.message?.includes('ERR_NETWORK')) {
    message.error('网络连接异常，请检查网络状态');
  } else if (error.message?.includes('ERR_INTERNET_DISCONNECTED')) {
    message.error('网络连接已断开，请检查网络连接');
  } else if (error.message?.includes('ERR_CONNECTION_REFUSED')) {
    message.error('连接被拒绝，服务器可能不可用');
  } else {
    message.error('网络请求失败，请稍后重试');
  }
};

export const errorConfig = {
  baseURL: window.__POWERED_BY_QIANKUN__ ? window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ : '',
  errorConfig: {
    errorThrower: (res: any) => {
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
        throw error;
      }
    },
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage || '警告');
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage || '错误');
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({ description: errorMessage, message: errorCode });
              break;
            case ErrorShowType.REDIRECT:
              break;
            default:
              message.error(errorMessage || '未知错误');
          }
        }
      } else if (error.response) {
        const { data } = error.response;
        if (error.response.status === 0) {
          handleNetworkError(error);
          return;
        }
        if (data) {
          if (data instanceof Blob) {
            messageBlobError(data);
          }
          switch (data.code) {
            case ErrorCode.UN_LOGIN:
              message.error(data.message);
              goBackLogin();
              break;
            case ErrorCode.PASSWORD_EXPIRED:
              message.error(data.message);
              history.replace({ pathname: Path.CHANGE_PASSWORD });
              break;
            default:
              console.error(data.message ?? error.message);
              message.error(data.message ?? error.message);
          }
        }
      } else if (error.request) {
        handleNetworkError(error);
      } else {
        console.error('请求错误:', {
          message: error.message,
          config: error.config,
          timestamp: new Date().toISOString(),
        });
        message.error('请求错误，请稍后重试');
      }
    },
  },
  requestInterceptors: [
    (config: any) => {
      const authToken = localStorage.getItem('x-auth-token') as string;
      if (authToken) {
        config.headers = { ...config.headers, 'X-Auth-Token': authToken };
      }
      return config;
    },
  ],
  responseInterceptors: [
    (response: any) => {
      if (response?.headers?.['x-auth-token']) {
        localStorage.setItem('x-auth-token', response?.headers?.['x-auth-token']);
      }
      const { data } = response as unknown as ResponseStructure;
      if (data.success === true) {
        return response;
      }
      if (data.success === false) {
        message.error('请求失败！');
        return response;
      }
      if (data instanceof Blob || data instanceof ArrayBuffer) {
        return response;
      }

      const isMultipleLogin =
        (data as unknown as string) ===
        'This session has been expired (possibly due to multiple concurrent logins being attempted as the same user).';
      if (data?.code === '6' || data?.code === '7' || isMultipleLogin) {
        goBackLogin();
        return response;
      }
      if (data.order || data.processDefinitionId || Array.isArray(data)) {
        data.success = true;
        return response;
      }
      if (!data) {
        return response;
      }

      if (data.code !== '0') {
        handleApiError(response, data);
        data.success = false;
        return response;
      }
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
