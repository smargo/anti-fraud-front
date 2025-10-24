/**
 * EventDetailList 页面辅助函数
 */

import {
  createEventDetail,
  deleteEventDetail,
  queryEventDetails,
  updateEventDetail,
} from '@/services/antifraud/eventDetail';
import { message } from 'antd';
import moment from 'moment';
import type { EventDetailFormValues, EventDetailItem } from './types';

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string, separator: string = '-') => {
  if (!date) return '-';
  return moment(date).format(`YYYY${separator}MM${separator}DD HH:mm:ss`);
};

/**
 * 处理事件详情删除
 */
export const handleEventDetailDelete = async (id: string, onSuccess?: () => void) => {
  try {
    const response = await deleteEventDetail(id);
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
 * 处理事件详情表单提交
 */
export const handleEventDetailFormSubmit = async (
  values: EventDetailFormValues,
  editingEventDetail: EventDetailItem | null,
  onSuccess?: () => void,
) => {
  try {
    if (editingEventDetail) {
      const response = await updateEventDetail({ ...values, id: editingEventDetail.id });
      if (response.code === '0') {
        message.success('更新成功');
      } else {
        message.error(response.message || '更新失败');
        return;
      }
    } else {
      const response = await createEventDetail(values);
      if (response.code === '0') {
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

/**
 * 获取事件详情列表数据
 */
export const fetchEventDetailList = async (params: any) => {
  return queryEventDetails(params);
};

/**
 * 格式化处理时间
 */
export const formatProcessTime = (processTime: number) => {
  if (!processTime) return '-';
  return `${processTime}ms`;
};

/**
 * 获取状态标签颜色
 */
export const getStatusColor = (status: string) => {
  const statusColorMap: Record<string, string> = {
    SUCCESS: 'green',
    FAILED: 'red',
    PROCESSING: 'blue',
    PENDING: 'orange',
    TIMEOUT: 'purple',
  };
  return statusColorMap[status] || 'default';
};

/**
 * 获取结果标签颜色
 */
export const getResultColor = (result: string) => {
  const resultColorMap: Record<string, string> = {
    PASS: 'green',
    REJECT: 'red',
    MANUAL: 'orange',
    ERROR: 'purple',
  };
  return resultColorMap[result] || 'default';
};
