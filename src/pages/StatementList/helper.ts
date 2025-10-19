/**
 * StatementList 页面辅助函数
 */

import { message } from 'antd';
import moment from 'moment';
import { getDictText } from '@/utils/dictUtils';
import { statementApi } from '@/services/antifraud/statement';
import type { StatementItem, StatementFormValues } from './types';

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string, separator: string = '-') => {
  if (!date) return '-';
  return moment(date).format(`YYYY${separator}MM${separator}DD HH:mm:ss`);
};

/**
 * 处理语句删除
 */
export const handleStatementDelete = async (id: number, onSuccess?: () => void) => {
  try {
    const response = await statementApi.delete(id);
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
 * 处理语句表单提交
 */
export const handleStatementFormSubmit = async (
  values: StatementFormValues,
  editingStatement: StatementItem | null,
  onSuccess?: () => void,
) => {
  try {
    if (editingStatement) {
      const response = await statementApi.update(editingStatement.id!, values);
      if (response.code === 'SUCCESS') {
        message.success('更新成功');
      } else {
        message.error(response.message || '更新失败');
        return;
      }
    } else {
      const response = await statementApi.create(values);
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
 * 获取语句列表数据
 */
export const fetchStatementList = async (params: any) => {
  return statementApi.query(params);
};
