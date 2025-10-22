/* eslint-disable @typescript-eslint/no-unsafe-call */
import { message } from 'antd';

/**
 * 消息工具类
 * 用于统一处理应用中的消息显示
 * 注意：在组件中优先使用 useMessage hook，此工具类仅用于非组件环境
 *
 * 在非组件环境中使用静态 message API 是安全的，因为这里不需要主题上下文
 * 虽然会触发警告，但这是 Ant Design 5.x 的限制，在非组件环境中无法避免
 */
export class MessageUtils {
  /**
   * 显示错误消息
   * @param content 消息内容
   * @param duration 显示时长（秒）
   */
  static error(content: string, duration: number = 2) {
    // 在非组件环境中使用静态 message API 是安全的
    // 虽然会触发警告，但这是 Ant Design 5.x 的限制
    message.error(content, duration);
  }

  /**
   * 显示成功消息
   * @param content 消息内容
   * @param duration 显示时长（秒）
   */
  static success(content: string, duration: number = 2) {
    // 在非组件环境中使用静态 message API 是安全的
    // 虽然会触发警告，但这是 Ant Design 5.x 的限制
    message.success(content, duration);
  }

  /**
   * 显示警告消息
   * @param content 消息内容
   * @param duration 显示时长（秒）
   */
  static warning(content: string, duration: number = 2) {
    // 在非组件环境中使用静态 message API 是安全的
    // 虽然会触发警告，但这是 Ant Design 5.x 的限制
    message.warning(content, duration);
  }

  /**
   * 显示信息消息
   * @param content 消息内容
   * @param duration 显示时长（秒）
   */
  static info(content: string, duration: number = 2) {
    // 在非组件环境中使用静态 message API 是安全的
    // 虽然会触发警告，但这是 Ant Design 5.x 的限制
    message.info(content, duration);
  }

  /**
   * 显示加载消息
   * @param content 消息内容
   * @param duration 显示时长（秒）
   */
  static loading(content: string, duration: number = 0) {
    // 在非组件环境中使用静态 message API 是安全的
    // 虽然会触发警告，但这是 Ant Design 5.x 的限制
    return message.loading(content, duration);
  }
}

/**
 * 兼容性导出，保持与原有代码的兼容性
 * 建议在新代码中使用 useMessage hook
 */
export const showError = MessageUtils.error;
export const showSuccess = MessageUtils.success;
export const showWarning = MessageUtils.warning;
export const showInfo = MessageUtils.info;
export const showLoading = MessageUtils.loading;
