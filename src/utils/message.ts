import { message } from 'antd';

/**
 * 消息工具类
 * 用于统一处理应用中的消息显示
 * 注意：在组件中优先使用 useMessage hook，此工具类仅用于非组件环境
 */
export class MessageUtils {
  /**
   * 显示错误消息
   * @param content 消息内容
   * @param duration 显示时长（秒）
   */
  static error(content: string, duration: number = 2): void {
    message.error(content, duration);
  }

  /**
   * 显示成功消息
   * @param content 消息内容
   * @param duration 显示时长（秒）
   */
  static success(content: string, duration: number = 2): void {
    message.success(content, duration);
  }

  /**
   * 显示警告消息
   * @param content 消息内容
   * @param duration 显示时长（秒）
   */
  static warning(content: string, duration: number = 2): void {
    message.warning(content, duration);
  }

  /**
   * 显示信息消息
   * @param content 消息内容
   * @param duration 显示时长（秒）
   */
  static info(content: string, duration: number = 2): void {
    message.info(content, duration);
  }

  /**
   * 显示加载消息
   * @param content 消息内容
   * @param duration 显示时长（秒），0 表示不自动关闭
   * @returns 关闭函数
   */
  static loading(content: string, duration: number = 0): () => void {
    return message.loading(content, duration);
  }

  /**
   * 显示确认消息
   * @param content 消息内容
   * @param duration 显示时长（秒）
   */
  static confirm(content: string, duration: number = 3): void {
    message.info(content, duration);
  }

  /**
   * 显示自定义消息
   * @param content 消息内容
   * @param type 消息类型
   * @param duration 显示时长（秒）
   */
  static custom(
    content: string,
    type: 'success' | 'error' | 'warning' | 'info',
    duration: number = 2,
  ): void {
    message[type](content, duration);
  }

  /**
   * 批量显示消息
   * @param messages 消息数组
   * @param type 消息类型
   * @param duration 显示时长（秒）
   */
  static batch(
    messages: string[],
    type: 'success' | 'error' | 'warning' | 'info',
    duration: number = 2,
  ): void {
    messages.forEach((msg, index) => {
      setTimeout(() => {
        message[type](msg, duration);
      }, index * 100); // 每个消息间隔 100ms
    });
  }

  /**
   * 显示带操作的消息
   * @param content 消息内容
   * @param action 操作文本
   * @param onAction 操作回调
   * @param type 消息类型
   * @param duration 显示时长（秒）
   */
  static withAction(
    content: string,
    action: string,
    onAction: () => void,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration: number = 3,
  ): void {
    const hide = message[type]({
      content: `${content} - ${action}`,
      duration,
    });

    // 延迟执行操作
    setTimeout(() => {
      onAction();
    }, duration * 1000);
  }

  /**
   * 显示进度消息
   * @param content 消息内容
   * @param progress 进度百分比 (0-100)
   * @param duration 显示时长（秒）
   * @returns 更新函数
   */
  static progress(
    content: string,
    progress: number = 0,
    duration: number = 0,
  ): (newProgress: number) => void {
    const hide = message.loading({
      content: `${content} - ${progress}%`,
      duration,
    });

    return (newProgress: number) => {
      // 这里可以实现进度更新逻辑
      console.log(`Progress updated to ${newProgress}%`);
    };
  }

  /**
   * 清除所有消息
   */
  static destroy(): void {
    message.destroy();
  }

  /**
   * 配置消息全局设置
   * @param config 配置对象
   */
  static config(config: {
    top?: number;
    duration?: number;
    maxCount?: number;
    rtl?: boolean;
    prefixCls?: string;
  }): void {
    message.config(config);
  }
}

// 兼容性导出，保持与原有代码的兼容性
export const showError = MessageUtils.error;
export const showSuccess = MessageUtils.success;
export const showWarning = MessageUtils.warning;
export const showInfo = MessageUtils.info;
export const showLoading = MessageUtils.loading;
export const showConfirm = MessageUtils.confirm;
export const showCustom = MessageUtils.custom;
export const showBatch = MessageUtils.batch;
export const showWithAction = MessageUtils.withAction;
export const showProgress = MessageUtils.progress;
export const destroyMessages = MessageUtils.destroy;
export const configMessages = MessageUtils.config;
