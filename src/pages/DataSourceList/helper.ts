/**
 * DataSourceList 页面辅助函数
 */

import { dataSourceApi } from '@/services/antifraud/datasource';
import { message } from 'antd';
import moment from 'moment';
import type { DataSourceFormValues, DataSourceItem } from './types';

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: string, separator: string = '-') => {
  if (!date) return '-';
  return moment(date).format(`YYYY${separator}MM${separator}DD HH:mm:ss`);
};

/**
 * 处理数据源删除
 */
export const handleDataSourceDelete = async (dataSourceNo: string, onSuccess?: () => void) => {
  try {
    const response = await dataSourceApi.deleteDataSource(dataSourceNo);
    if (response.code === '0') {
      message.success('删除成功');
      onSuccess?.();
    } else {
      message.error(response.message || '删除失败');
    }
  } catch (error: any) {
    if (error.message) {
      message.error('删除异常：' + error.message);
    } else {
      message.error('删除失败：' + (error.message || '未知错误'));
    }
  }
};

/**
 * 处理数据源表单提交
 */
export const handleDataSourceFormSubmit = async (
  values: DataSourceFormValues,
  editingDataSource: DataSourceItem | null,
  onSuccess?: () => void,
) => {
  try {
    if (editingDataSource) {
      const response = await dataSourceApi.updateDataSource(editingDataSource.dataSourceNo, {
        ...values,
        id: editingDataSource.id,
      });
      if (response.code === '0') {
        message.success('更新成功');
      } else {
        message.error(response.message || '更新失败');
        return;
      }
    } else {
      const response = await dataSourceApi.createDataSource(values);
      if (response.code === '0') {
        message.success('创建成功');
      } else {
        message.error(response.message || '创建失败');
        return;
      }
    }
    onSuccess?.();
  } catch (error: any) {
    if (error.message) {
      message.error(error.message);
    } else {
      message.error('操作失败：' + (error.message || '未知错误'));
    }
  }
};

/**
 * 获取数据源列表数据
 */
export const fetchDataSourceList = async (params: any) => {
  try {
    const response = await dataSourceApi.dataSourcePage(params);
    return response;
  } catch (error) {
    console.error('获取数据源列表失败:', error);
    return {
      data: [],
      success: false,
      total: 0,
    };
  }
};
