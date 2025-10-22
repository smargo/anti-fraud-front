import '@umijs/max';
import { Button, message, notification } from 'antd';
import defaultSettings from '../config/defaultSettings';

// 需要过滤的警告消息常量
const FILTERED_WARNINGS = [
  'findDOMNode is deprecated',
  'findDOMNode is deprecated and will be removed',
  "[antd: message] Static function can not consume context like dynamic theme. Please use 'App' component instead.",
  '[antd: Table] `index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.',
  '[antd: Button] `icon` is using ReactNode instead of string naming in v4. Please check `eye` at https://ant.design/components/icon',
  '[antd: Tooltip] `visible` is deprecated. Please use `open` instead.',
  '[antd: Tooltip] `overlayClassName` is deprecated. Please use `classNames={{ root: "" }}` instead.',
  '[antd: Button.Group] `Button.Group` is deprecated. Please use `Space.Compact` instead.',
  'Each child in a list should have a unique "key" prop.',
];

const { pwa } = defaultSettings;
const isHttps = document.location.protocol === 'https:';
const clearCache = () => {
  // remove all caches
  if (window.caches) {
    caches
      .keys()
      .then((keys) => {
        keys.forEach((key) => {
          caches.delete(key);
        });
      })
      .catch((e) => console.log(e));
  }
};

// 在应用启动前抑制 findDOMNode 和 Ant Design 警告
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      FILTERED_WARNINGS.some((filter) => message.includes(filter))
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  console.error = (...args) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      FILTERED_WARNINGS.some((filter) => message.includes(filter))
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

// if pwa is true
if (pwa) {
  // Notify user if offline now
  window.addEventListener('sw.offline', () => {
    // 在全局环境中使用静态 message API 是安全的，因为这里不需要主题上下文
    message.warning('当前处于离线状态');
  });

  // Pop up a prompt on the page asking the user if they want to use the latest version
  window.addEventListener('sw.updated', (event: Event) => {
    const e = event as CustomEvent;
    const reloadSW = async () => {
      // Check if there is sw whose state is waiting in ServiceWorkerRegistration
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;
      if (!worker) {
        return true;
      }
      // Send skip-waiting event to waiting SW with MessageChannel
      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (msgEvent) => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };
        worker.postMessage(
          {
            type: 'skip-waiting',
          },
          [channel.port2],
        );
      });
      clearCache();
      window.location.reload();
      return true;
    };
    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.destroy(key);
          reloadSW();
        }}
      >
        {'刷新'}
      </Button>
    );
    notification.open({
      message: '有新内容',
      description: '请点击“刷新”按钮或者手动刷新页面',
      btn,
      key,
      onClose: async () => null,
    });
  });
} else if ('serviceWorker' in navigator && isHttps) {
  // unregister service worker
  const { serviceWorker } = navigator;
  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then((sws) => {
      sws.forEach((sw) => {
        sw.unregister();
      });
    });
  }
  serviceWorker.getRegistration().then((sw) => {
    if (sw) sw.unregister();
  });
  clearCache();
}
