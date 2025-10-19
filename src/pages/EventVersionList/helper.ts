/**
 * EventVersionList 页面辅助函数
 */

import { message } from 'antd';
import moment from 'moment';
import { getDictText } from '@/utils/dictUtils';
import { queryEventVersions } from '@/services/antifraud/eventVersion';
import type { EventVersionItem } from './types';

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string, separator: string = '-') => {
  if (!date) return '-';
  return moment(date).format(`YYYY${separator}MM${separator}DD HH:mm:ss`);
};

/**
 * 获取事件版本列表数据
 */
export const fetchEventVersionList = async (params: any) => {
  return queryEventVersions(params);
};

/**
 * 获取状态标签颜色
 */
export const getStatusColor = (status: string) => {
  const statusColorMap: Record<string, string> = {
    ACTIVE: 'green',
    DRAFT: 'orange',
    APPROVED: 'blue',
    DEPRECATED: 'red',
  };
  return statusColorMap[status] || 'default';
};

