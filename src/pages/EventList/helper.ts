/**
 * EventList 页面辅助函数
 */

import {
  createEvent,
  deleteEvent,
  queryEvents,
  updateEventBasicInfo,
} from '@/services/antifraud/event';
import { formatDateTime } from '@/utils/helpers';
import { message, Modal } from 'antd';
import type { EventFormValues, EventItem } from './types';

/**
 * 格式化事件数据
 */
export const formatEventData = (event: EventItem) => ({
  ...event,
  createdDateFormatted: formatDateTime(event.createdDate, '-'),
  lastModifiedDateFormatted: formatDateTime(event.lastModifiedDate, '-'),
});

/**
 * 处理事件删除
 */
export const handleEventDelete = async (id: string, onSuccess?: () => void) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这个事件吗？',
    onOk: async () => {
      try {
        const response = await deleteEvent(id);
        if (response.code === '0') {
          message.success(response.message || '删除成功');
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
    },
  });
};

/**
 * 处理事件表单提交
 */
export const handleEventFormSubmit = async (
  values: EventFormValues,
  editingEvent: EventItem | null,
  onSuccess?: () => void,
) => {
  try {
    if (editingEvent) {
      // 编辑时只更新事件名称和描述
      const response = await updateEventBasicInfo(editingEvent.id, {
        eventName: values.eventName,
        eventDesc: values.eventDesc,
      });
      if (response.code === '0') {
        message.success('更新成功');
      } else {
        message.error(response.message || '更新失败');
        return;
      }
    } else {
      const response = await createEvent(values);
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

/**
 * 获取事件列表数据
 */
export const fetchEventList = async (params: any) => {
  return queryEvents(params);
};
