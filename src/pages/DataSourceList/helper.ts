/**
 * DataSourceList 页面辅助函数
 */

import { dataSourceApi } from '@/services/antifraud/datasource';
import { getDictText, type DictItem } from '@/utils/dictUtils';
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
    const response = await dataSourceApi.delete(dataSourceNo);
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
      const response = await dataSourceApi.update(editingDataSource.dataSourceNo, {
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
      const response = await dataSourceApi.create(values);
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
    const response = await dataSourceApi.list(params);
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

/**
 * 生成表格列配置
 */
export const generateColumns = (
  dataSourceTypeOptions: DictItem[],
  onView: (record: DataSourceItem) => void,
  onEdit: (record: DataSourceItem) => void,
  onDelete: (dataSourceNo: string) => void,
) => {
  return [
    {
      title: '数据源编号',
      dataIndex: 'dataSourceNo',
      key: 'dataSourceNo',
      width: 150,
      search: {
        allowClear: true,
        placeholder: '请输入数据源编号',
      },
    },
    {
      title: '数据源名称',
      dataIndex: 'dataSourceName',
      key: 'dataSourceName',
      width: 200,
      search: {
        allowClear: true,
        placeholder: '请输入数据源名称',
      },
    },
    {
      title: '数据源类型',
      dataIndex: 'dataSourceType',
      key: 'dataSourceType',
      width: 120,
      search: true,
      render: (_: any, record: DataSourceItem) => {
        return getDictText(dataSourceTypeOptions, record.dataSourceType);
      },
    },
    {
      title: '用户名',
      dataIndex: 'dataSourceUserName',
      key: 'dataSourceUserName',
      width: 120,
      hideInSearch: true,
      render: (text: string) => text || '-',
    },
    {
      title: '连接字符串',
      dataIndex: 'dataSourceConnectString',
      key: 'dataSourceConnectString',
      width: 300,
      hideInSearch: true,
      ellipsis: true,
      render: (text: string) => {
        const connectString = text || '-';
        return connectString;
      },
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 150,
      render: (_: any, record: DataSourceItem) => [
        { text: '查看', onClick: () => onView(record) },
        { text: '编辑', onClick: () => onEdit(record) },
        { text: '删除', onClick: () => onDelete(record.dataSourceNo) },
      ],
    },
  ];
};
