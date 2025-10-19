import { getMasterProps } from './masterProps';

// 微前端相关类型定义
export interface MicroAppProps {
  name?: string;
  url?: string;
  container?: string | HTMLElement;
  props?: Record<string, any>;
  sandbox?: boolean | Record<string, any>;
  singular?: boolean;
  fetch?: (url: string, options?: RequestInit) => Promise<Response>;
  getPublicPath?: (entry: string) => string;
  getTemplate?: (tpl: string) => string;
  beforeLoad?: (app: any) => Promise<any>;
  beforeMount?: (app: any) => Promise<any>;
  afterMount?: (app: any) => Promise<any>;
  beforeUnmount?: (app: any) => Promise<any>;
  afterUnmount?: (app: any) => Promise<any>;
}

export interface MicroAppInfo {
  name: string;
  entry: string;
  container: string;
  activeRule: string;
  props?: Record<string, any>;
}

// 微前端应用配置
export const microApps: MicroAppInfo[] = [
  {
    name: 'cas-front',
    entry: '//localhost:8001',
    container: '#subapp-viewport',
    activeRule: '/cas',
    props: {
      basename: '/cas',
    },
  },
  {
    name: 'anti-fraud-frontend',
    entry: '//localhost:8000',
    container: '#subapp-viewport',
    activeRule: '/anti-fraud',
    props: {
      basename: '/anti-fraud',
    },
  },
];

// 获取微前端应用配置
export const getMicroAppConfig = (name: string): MicroAppInfo | undefined => {
  return microApps.find((app) => app.name === name);
};

// 获取所有微前端应用配置
export const getAllMicroApps = (): MicroAppInfo[] => {
  return microApps;
};

// 检查是否在微前端环境中运行
export const isMicroApp = (): boolean => {
  return !!(window as any).__POWERED_BY_QIANKUN__;
};

// 获取微前端应用名称
export const getMicroAppName = (): string | undefined => {
  return (window as any).__INJECTED_PUBLIC_PATH_BY_QIANKUN__
    ? (window as any).__POWERED_BY_QIANKUN__
    : undefined;
};

// 获取微前端公共路径
export const getMicroAppPublicPath = (): string | undefined => {
  return (window as any).__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
};

// 获取主应用传递的属性
export const getMasterAppProps = (): any => {
  return getMasterProps();
};

// 向主应用发送消息
export const sendMessageToMaster = (message: any): void => {
  if (isMicroApp()) {
    // 在微前端环境中，可以通过 postMessage 向主应用发送消息
    window.parent.postMessage(message, '*');
  }
};

// 监听主应用消息
export const listenMasterMessage = (callback: (message: any) => void): (() => void) => {
  const handleMessage = (event: MessageEvent) => {
    // 验证消息来源（可选）
    // if (event.origin !== 'http://localhost:3000') return;

    callback(event.data);
  };

  window.addEventListener('message', handleMessage);

  // 返回清理函数
  return () => {
    window.removeEventListener('message', handleMessage);
  };
};

// 微前端路由工具
export const microAppRouter = {
  // 跳转到微前端应用
  navigateToMicroApp: (appName: string, path: string = '') => {
    const app = getMicroAppConfig(appName);
    if (app) {
      const fullPath = `${app.activeRule}${path}`;
      window.history.pushState(null, '', fullPath);
    }
  },

  // 获取当前微前端应用路径
  getCurrentMicroAppPath: (): string => {
    const pathname = window.location.pathname;
    const app = microApps.find((app) => pathname.startsWith(app.activeRule));
    if (app) {
      return pathname.replace(app.activeRule, '');
    }
    return pathname;
  },

  // 检查是否在指定微前端应用中
  isInMicroApp: (appName: string): boolean => {
    const pathname = window.location.pathname;
    const app = getMicroAppConfig(appName);
    return app ? pathname.startsWith(app.activeRule) : false;
  },
};

// 微前端状态管理
export const microAppState = {
  // 设置微前端应用状态
  setState: (key: string, value: any): void => {
    if (isMicroApp()) {
      const state = JSON.parse(localStorage.getItem('microAppState') || '{}');
      state[key] = value;
      localStorage.setItem('microAppState', JSON.stringify(state));
    }
  },

  // 获取微前端应用状态
  getState: (key: string): any => {
    if (isMicroApp()) {
      const state = JSON.parse(localStorage.getItem('microAppState') || '{}');
      return state[key];
    }
    return undefined;
  },

  // 清除微前端应用状态
  clearState: (key?: string): void => {
    if (isMicroApp()) {
      if (key) {
        const state = JSON.parse(localStorage.getItem('microAppState') || '{}');
        delete state[key];
        localStorage.setItem('microAppState', JSON.stringify(state));
      } else {
        localStorage.removeItem('microAppState');
      }
    }
  },
};

// 微前端通信工具
export const microAppCommunication = {
  // 发送事件到主应用
  emit: (eventName: string, data?: any): void => {
    sendMessageToMaster({
      type: 'microAppEvent',
      eventName,
      data,
      source: getMicroAppName(),
    });
  },

  // 监听主应用事件
  on: (eventName: string, callback: (data?: any) => void): (() => void) => {
    return listenMasterMessage((message) => {
      if (message.type === 'masterEvent' && message.eventName === eventName) {
        callback(message.data);
      }
    });
  },

  // 请求主应用数据
  request: (action: string, params?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const requestId = Date.now().toString();

      const cleanup = listenMasterMessage((message) => {
        if (message.type === 'masterResponse' && message.requestId === requestId) {
          cleanup();
          if (message.success) {
            resolve(message.data);
          } else {
            reject(new Error(message.error));
          }
        }
      });

      sendMessageToMaster({
        type: 'microAppRequest',
        action,
        params,
        requestId,
        source: getMicroAppName(),
      });

      // 设置超时
      setTimeout(() => {
        cleanup();
        reject(new Error('Request timeout'));
      }, 10000);
    });
  },
};

// 微前端生命周期工具
export const microAppLifecycle = {
  // 应用启动
  onBootstrap: (callback: () => void): void => {
    if (isMicroApp()) {
      callback();
    }
  },

  // 应用挂载
  onMount: (callback: () => void): void => {
    if (isMicroApp()) {
      callback();
    }
  },

  // 应用卸载
  onUnmount: (callback: () => void): void => {
    if (isMicroApp()) {
      callback();
    }
  },

  // 应用更新
  onUpdate: (callback: () => void): void => {
    if (isMicroApp()) {
      callback();
    }
  },
};

// 导出所有工具
export default {
  microApps,
  getMicroAppConfig,
  getAllMicroApps,
  isMicroApp,
  getMicroAppName,
  getMicroAppPublicPath,
  getMasterAppProps,
  sendMessageToMaster,
  listenMasterMessage,
  microAppRouter,
  microAppState,
  microAppCommunication,
  microAppLifecycle,
};

