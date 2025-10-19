/**
 * EventDetail 页面辅助函数
 */

import { message } from 'antd';
import moment from 'moment';
import { getEventDetailRecord } from '@/services/antifraud/event';
import type { EventDetailRecord } from './types';

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string, separator: string = '-') => {
  if (!date) return '-';
  return moment(date).format(`YYYY${separator}MM${separator}DD HH:mm:ss`);
};

/**
 * 获取事件详情
 */
export const fetchEventDetail = async (eventTransNo: string): Promise<EventDetailRecord | null> => {
  try {
    const response = await getEventDetailRecord(eventTransNo);
    if (response?.data) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * 格式化处理时间
 */
export const formatProcessTime = (processTime: number) => {
  if (!processTime) return '-';
  return `${processTime}ms`;
};

/**
 * 状态映射
 */
export const statusMap: Record<string, string> = {
  'INIT': '初始化',
  'PROCESSING': '处理中',
  'COMPLETED': '已完成',
  'FAILED': '失败',
};

/**
 * 结果映射
 */
export const resultMap: Record<string, string> = {
  'PASS': '通过',
  'REJECT': '拒绝',
  'REVIEW': '人工审核',
};

/**
 * 事件类型映射
 */
export const eventTypeMap: Record<string, string> = {
  'AUTH': '认证',
  'TRANSACTION': '交易',
  'USER': '用户',
  'FINANCE': '金融',
};

/**
 * 获取状态标签颜色
 */
export const getStatusColor = (status: string) => {
  const statusColorMap: Record<string, string> = {
    'INIT': 'blue',
    'PROCESSING': 'processing',
    'COMPLETED': 'success',
    'FAILED': 'error',
  };
  return statusColorMap[status] || 'default';
};

/**
 * 获取结果标签颜色
 */
export const getResultColor = (result: string) => {
  switch (result) {
    case 'PASS': return 'success';
    case 'REJECT': return 'error';
    case 'REVIEW': return 'warning';
    default: return 'default';
  }
};

/**
 * 格式化JSON内容
 */
export const formatContent = (content: string) => {
  try {
    const contentObj = JSON.parse(content);
    return JSON.stringify(contentObj, null, 2);
  } catch (e) {
    return content;
  }
};

