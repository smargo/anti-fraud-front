/**
 * IndicatorList 页面辅助函数
 */

import { message } from 'antd';
import moment from 'moment';
import { indicatorApi } from '@/services/antifraud/indicator';
import type { IndicatorItem, IndicatorFormValues } from './types';

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
export const handleIndicatorDelete = async (indicatorNo: string, onSuccess?: () => void) => {
  try {
    const response = await indicatorApi.delete(indicatorNo);
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
 * 处理指标表单提交
 */
export const handleIndicatorFormSubmit = async (
  values: IndicatorFormValues,
  editingIndicator: IndicatorItem | null,
  onSuccess?: () => void,
) => {
  try {
    if (editingIndicator) {
      const response = await indicatorApi.update(editingIndicator.indicatorNo, values);
      if (response.code === 'SUCCESS') {
        message.success('更新成功');
      } else {
        message.error(response.message || '更新失败');
        return;
      }
    } else {
      const response = await indicatorApi.create(values);
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
 * 获取指标列表数据
 */
export const fetchIndicatorList = async (params: any) => {
  return indicatorApi.query(params);
};

/**
 * 生成表格列配置
 */
export const generateColumns = (
  onView: (record: IndicatorItem) => void,
  onEdit: (record: IndicatorItem) => void,
  onDelete: (indicatorNo: string) => void,
) => {
  return [
    {
      title: '指标编号',
      dataIndex: 'indicatorNo',
      key: 'indicatorNo',
      width: 150,
      search: true,
    },
    {
      title: '指标名称',
      dataIndex: 'indicatorName',
      key: 'indicatorName',
      width: 200,
      search: true,
    },
    {
      title: '指标描述',
      dataIndex: 'indicatorDesc',
      key: 'indicatorDesc',
      width: 300,
      hideInSearch: true,
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '查询编号',
      dataIndex: 'queryNo',
      key: 'queryNo',
      width: 150,
      hideInSearch: true,
      render: (text: string) => text || '-',
    },
    {
      title: '查询字段',
      dataIndex: 'queryField',
      key: 'queryField',
      width: 200,
      hideInSearch: true,
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
      hideInSearch: true,
      render: (_: any, record: IndicatorItem) => formatDateTime(record.createdDate),
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 150,
      render: (_: any, record: IndicatorItem) => [
        { text: '查看', onClick: () => onView(record) },
        { text: '编辑', onClick: () => onEdit(record) },
        { text: '删除', onClick: () => onDelete(record.indicatorNo) },
      ],
    },
  ];
};
