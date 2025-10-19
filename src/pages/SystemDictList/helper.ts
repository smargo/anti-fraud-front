/**
 * SystemDictList 页面辅助函数
 */

import { message } from 'antd';
import moment from 'moment';
import { getDictText, convertDictToValueEnum, type DictItem } from '@/utils/dictUtils';
import { createDict, updateDict, deleteDict, queryDicts, refreshDicts } from '@/services/dict/dict';
import type { SystemDictItem, SystemDictFormValues } from './types';

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
      if (response.code === 'SUCCESS') {
        message.success('更新成功');
      } else {
        message.error(response.message || '更新失败');
        return;
      }
    } else {
      const response = await createDict(values);
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
    if (response?.code === 'SUCCESS') {
      message.success(response?.message || '字典数据刷新成功');
      onSuccess?.();
    } else {
      message.error(response?.message || '字典数据刷新失败');
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else {
      message.error('字典数据刷新失败：' + (error.message || '未知错误'));
    }
  }
};

/**
 * 生成表格列配置
 */
export const generateColumns = (enableOptions: DictItem[], onView: (record: SystemDictItem) => void, onEdit: (record: SystemDictItem) => void, onDelete: (id: number) => void) => {
  return [
    {
      title: '代码编号',
      dataIndex: 'codeNo',
      key: 'codeNo',
      width: 120,
      search: true,
      rules: [{ required: true, message: '请输入代码编号' }],
      valueType: 'text',
    },
    {
      title: '代码项编号',
      dataIndex: 'itemNo',
      key: 'itemNo',
      width: 120,
      search: true,
      rules: [{ required: true, message: '请输入代码项编号' }],
      valueType: 'text',
    },
    {
      title: '代码项值',
      dataIndex: 'itemValue',
      key: 'itemValue',
      width: 120,
      search: true,
      rules: [{ required: true, message: '请输入代码项值' }],
      valueType: 'text',
    },
    {
      title: '代码描述',
      dataIndex: 'itemDescribe',
      key: 'itemDescribe',
      width: 200,
      hideInSearch: true,
      ellipsis: true,
      render: (_: any, record: SystemDictItem) => record.itemDescribe || '-',
      valueType: 'text',
    },
    {
      title: '排序编号',
      dataIndex: 'sortNo',
      key: 'sortNo',
      width: 100,
      search: false,
      valueType: 'digit',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      search: true,
      valueEnum: convertDictToValueEnum(enableOptions),
      render: (_: any, record: SystemDictItem) => {
        const statusText = getDictText(enableOptions, record.status || '');
        return statusText;
      },
      filters: true,
      onFilter: true,
      allowClear: true,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 150,
      render: (_: any, record: SystemDictItem) => [
        { text: '查看', onClick: () => onView(record) },
        { text: '编辑', onClick: () => onEdit(record) },
        { text: '删除', onClick: () => onDelete(record.id!) },
      ],
    },
  ];
};
