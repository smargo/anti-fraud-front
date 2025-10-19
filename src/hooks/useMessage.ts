import { App } from 'antd';

/**
 * 自定义 hook 用于获取 Ant Design 的 message 实例
 * 解决静态 message API 无法消费动态主题的问题
 * @returns message 实例
 */
export const useMessage = () => {
  const { message } = App.useApp();
  return message;
};

/**
 * 导出 App 组件，用于在组件树中提供上下文
 */
export { App };

