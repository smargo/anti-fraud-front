/**
 * SystemDictList 页面辅助函数
 */

import { createDict, deleteDict, queryDicts, refreshDicts, updateDict } from '@/services/dict/dict';
import { message } from 'antd';
import moment from 'moment';
import type { SystemDictFormValues, SystemDictItem } from './types';

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string, separator: string = '-') => {
  if (!date) return '-';
  return moment(date).format(`YYYY${separator}MM${separator}DD HH:mm:ss`);
};

/**
 * 处理字典删除
 */
export const handleDictDelete = async (id: number, onSuccess?: () => void) => {
  try {
    const response = await deleteDict({ dictId: id });
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
 * 处理字典表单提交
 */
export const handleDictFormSubmit = async (
  values: SystemDictFormValues,
  editingDict: SystemDictItem | undefined,
  onSuccess?: () => void,
) => {
  try {
    if (editingDict) {
      const response = await updateDict({ ...values, id: editingDict.id });
      if (response.code === '0') {
        message.success('更新成功');
      } else {
        message.error(response.message || '更新失败');
        return;
      }
    } else {
      const response = await createDict(values);
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
 * 获取字典列表数据
 */
export const fetchDictList = async (params: any) => {
  return queryDicts(params);
};

/**
 * 处理字典缓存刷新
 */
export const handleDictRefresh = async (onSuccess?: () => void) => {
  try {
    const response = await refreshDicts();
    if (response?.code === '0') {
      message.success(response?.message || '字典数据刷新成功');
      onSuccess?.();
    } else {
      message.error(response?.message || '字典数据刷新失败');
    }
  } catch (error: any) {
    if (error?.message) {
      message.error(error.message);
    } else {
      message.error('字典数据刷新失败：未知错误');
    }
  }
};
