/**
 * EventIndicatorList 页面辅助函数
 */

import {
  createEventIndicator,
  deleteEventIndicator,
  updateEventIndicator,
} from '@/services/antifraud/eventIndicator';
import { message } from 'antd';
import moment from 'moment';
import type { EventIndicatorFormValues, EventIndicatorItem } from './types';

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string, separator: string = '-') => {
  if (!date) return '-';
  return moment(date).format(`YYYY${separator}MM${separator}DD HH:mm:ss`);
};

/**
 * 处理事件指标删除
 */
export const handleEventIndicatorDelete = async (id: number, onSuccess?: () => void) => {
  try {
    const response = await deleteEventIndicator(id);
    if (response.code === 'SUCCESS') {
      message.success('删除成功');
      onSuccess?.();
    } else {
      message.error(response.message || '删除失败');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else {
      message.error('删除失败：' + (error.message || '未知错误'));
    }
  }
};

/**
 * 处理事件指标表单提交
 */
export const handleEventIndicatorFormSubmit = async (
  values: EventIndicatorFormValues,
  editingEventIndicator: EventIndicatorItem | null,
  onSuccess?: () => void,
) => {
  try {
    if (editingEventIndicator) {
      const response = await updateEventIndicator(editingEventIndicator.id!, values);
      if (response.code === 'SUCCESS') {
        message.success('更新成功');
      } else {
        message.error(response.message || '更新失败');
        return;
      }
    } else {
      const response = await createEventIndicator(values);
      if (response.code === 'SUCCESS') {
        message.success('创建成功');
      } else {
        message.error(response.message || '创建失败');
        return;
      }
    }
    onSuccess?.();
  } catch (error: any) {
    if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else {
      message.error('操作失败：' + (error.message || '未知错误'));
    }
  }
};
