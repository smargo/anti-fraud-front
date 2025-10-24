/**
 * IndicatorList 页面辅助函数
 */

import { indicatorApi } from '@/services/antifraud/indicator';
import { message } from 'antd';
import moment from 'moment';
import type { IndicatorFormValues, IndicatorItem } from './types';

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string, separator: string = '-') => {
  if (!date) return '-';
  return moment(date).format(`YYYY${separator}MM${separator}DD HH:mm:ss`);
};

/**
 * 处理指标删除
 */
export const handleIndicatorDelete = async (indicatorId: number, onSuccess?: () => void) => {
  try {
    const response = await indicatorApi.delete(indicatorId);
    if (response.code === '0') {
      message.success('删除成功');
      onSuccess?.();
    } else {
      message.error(response.message || '删除失败');
    }
  } catch (error: any) {
    if (error?.message) {
      message.error(error.message);
    } else {
      message.error('删除失败：未知错误');
    }
  }
};

/**
 * 处理指标表单提交
 */
export const handleIndicatorFormSubmit = async (
  values: IndicatorFormValues,
  editingIndicator: IndicatorItem | null,
  onSuccess?: () => void,
) => {
  try {
    if (editingIndicator) {
      const response = await indicatorApi.update(editingIndicator.id, values);
      if (response.code === '0') {
        message.success('更新成功');
      } else {
        message.error(response.message || '更新失败');
        return;
      }
    } else {
      const response = await indicatorApi.create(values);
      if (response.code === '0') {
        message.success('创建成功');
      } else {
        message.error(response.message || '创建失败');
        return;
      }
    }
    onSuccess?.();
  } catch (error: any) {
    if (error?.message) {
      message.error(error.message);
    } else {
      message.error('操作失败：未知错误');
    }
  }
};
