/**
 * SystemDictTable 组件
 */

import React from 'react';
import { ProTable } from '@ant-design/pro-table';
import { Button, Space, Tooltip, Tag, Popconfirm } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { convertDictToValueEnum, getDictText, type DictItem } from '@/utils/dictUtils';
import { fetchDictList } from '../helper';
import type { SystemDictItem } from '../types';

interface SystemDictTableProps {
  actionRef: React.RefObject<ActionType>;
  enableOptions: DictItem[];
  onAdd: () => void;
  onView: (record: SystemDictItem) => void;
  onEdit: (record: SystemDictItem) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
}

const SystemDictTable: React.FC<SystemDictTableProps> = ({
  actionRef,
  enableOptions,
  onAdd,
  onView,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  // 表格列定义
  const columns: ProColumns<SystemDictItem>[] = [
    {
      title: '代码编号',
      dataIndex: 'codeNo',
      key: 'codeNo',
      width: 150,
      search: true,
      valueType: 'text',
    },
    {
      title: '代码项编号',
      dataIndex: 'itemNo',
      key: 'itemNo',
      width: 150,
      search: true,
      valueType: 'text',
    },
    {
      title: '代码项值',
      dataIndex: 'itemValue',
      key: 'itemValue',
      width: 200,
      search: false,
      valueType: 'text',
    },
    {
      title: '代码描述',
      dataIndex: 'itemDescribe',
      key: 'itemDescribe',
      width: 150,
      search: false,
      ellipsis: true,
      render: (content: string) => {
        return (
          <Tooltip placement="topLeft">
            <div style={{ 
              maxWidth: '180px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {content}
            </div>
          </Tooltip>
        );
      },
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
      render: (_: any, record: SystemDictItem) => {
        return getDictText(enableOptions, record.status || '');
      },
      search: true,
      valueType: 'select',
      valueEnum: convertDictToValueEnum(enableOptions),
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      width: 200,
      valueType: 'option',
      render: (_: any, record: SystemDictItem) => (
        <Space size="middle">
          <a onClick={() => onView(record)}>查看</a>
          <a onClick={() => onEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除这个字典项吗？"
            onConfirm={() => record.id && onDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ProTable<SystemDictItem, any>
      actionRef={actionRef}
      rowKey="id"
      scroll={{ x: 800 }}
      columns={columns}
      request={fetchDictList}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`,
      }}
      search={{ labelWidth: 100, showHiddenNum: true }}
      toolBarRender={() => [
        <Button type="primary" onClick={onAdd} icon={<PlusOutlined />}>
          新增字典项
        </Button>,
        <Button onClick={onRefresh} icon={<ReloadOutlined />}>
          刷新缓存
        </Button>,
      ]}
    />
  );
};

export default SystemDictTable;

