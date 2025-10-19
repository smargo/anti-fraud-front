/**
 * StatementTable 组件
 */

import React from 'react';
import { ProTable } from '@ant-design/pro-table';
import { Button, Card, Space, Tooltip, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { statementApi } from '@/services/antifraud/statement';
import type { StatementItem } from '../types';

interface StatementTableProps {
  actionRef: React.RefObject<ActionType>;
  mongoOperateOptions: any[];
  onAdd: () => void;
  onView: (record: StatementItem) => void;
  onEdit: (record: StatementItem) => void;
  onDelete: (id: number) => void;
}

const StatementTable: React.FC<StatementTableProps> = ({
  actionRef,
  mongoOperateOptions,
  onAdd,
  onView,
  onEdit,
  onDelete,
}) => {
  // 表格列定义
  const columns: any[] = [
    {
      title: '语句编号',
      dataIndex: 'statementNo',
      key: 'statementNo',
      width: 120,
      search: {
        allowClear: true,
        placeholder: '请输入语句编号',
      },
    },
    {
      title: '语句描述',
      dataIndex: 'statementDesc',
      key: 'statementDesc',
      width: 150,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="topLeft">
            <div style={{ 
              maxWidth: '180px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {text || '无'}
            </div>
          </Tooltip>
        );
      },
      search: {
        allowClear: true,
        placeholder: '请输入语句描述',
      },
    },
    {
      title: '数据源编号',
      dataIndex: 'dataSourceNo',
      key: 'dataSourceNo',
      width: 120,
      search: {
        allowClear: true,
        placeholder: '请输入数据源编号',
      },
    },
    {
      title: 'Bean ID',
      dataIndex: 'beanId',
      key: 'beanId',
      width: 120,
      search: false,
    },
    
    {
      title: '参数定义',
      dataIndex: 'statementParam',
      key: 'statementParam',
      width: 150,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="topLeft">
            <div style={{ 
              maxWidth: '180px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {text || '无'}
            </div>
          </Tooltip>
        );
      },
      search: false,
    },
    {
      title: '结果列表',
      dataIndex: 'resultList',
      key: 'resultList',
      width: 120,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="topLeft">
            <div style={{ 
              maxWidth: '100px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {text || '无'}
            </div>
          </Tooltip>
        );
      },
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 200,
      render: (_: any, record: StatementItem) => (
        <Space size="middle">
          <a onClick={() => onView(record)}>
            查看
          </a>
          <a onClick={() => onEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除这个处理语句吗？"
            onConfirm={() => onDelete(record.id!)}
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
    <Card>
      <ProTable<StatementItem, any>
        cardBordered
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
          >
            新增处理语句
          </Button>,
        ]}
        request={async (params) => {
          // 格式化搜索参数
          const searchParams = {
            ...params,
          };
          
          const response = await statementApi.list(searchParams);
          // 如果返回的是分页对象，直接返回
          return response;
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        columns={columns}
        rowKey="id"
      />
    </Card>
  );
};

export default StatementTable;

