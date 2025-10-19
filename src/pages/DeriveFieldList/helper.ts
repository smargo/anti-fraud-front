/**
 * DeriveFieldList 页面辅助函数
 */

import { message } from 'antd';
import moment from 'moment';
import { getDictText } from '@/utils/dictUtils';
import { createDeriveField, updateDeriveField, deleteDeriveField, queryDeriveFields } from '@/services/antifraud/deriveField';
import type { DeriveFieldItem, DeriveFieldFormValues } from './types';

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string, separator: string = '-') => {
  if (!date) return '-';
  return moment(date).format(`YYYY${separator}MM${separator}DD HH:mm:ss`);
};

/**
 * 处理衍生字段删除
 */
export const handleDeriveFieldDelete = async (id: number, onSuccess?: () => void) => {
  try {
    const response = await deleteDeriveField(id);
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
 * 处理衍生字段表单提交
 */
export const handleDeriveFieldFormSubmit = async (
  values: DeriveFieldFormValues,
  editingDeriveField: DeriveFieldItem | null,
  onSuccess?: () => void,
) => {
  try {
    if (editingDeriveField) {
      const response = await updateDeriveField(editingDeriveField.id!, values);
      if (response.code === 'SUCCESS') {
        message.success('更新成功');
      } else {
        message.error(response.message || '更新失败');
        return;
      }
    } else {
      const response = await createDeriveField(values);
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

/**
 * 获取衍生字段列表数据
 */
export const fetchDeriveFieldList = async (params: any) => {
  return queryDeriveFields(params);
};

