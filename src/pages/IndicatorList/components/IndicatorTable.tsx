/**
 * IndicatorTable 组件
 */

import { indicatorApi } from '@/services/antifraud/indicator';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-table';
import { Button, Card, Popconfirm, Space, Tooltip } from 'antd';
import React from 'react';
import type { IndicatorItem } from '../types';

interface IndicatorTableProps {
  actionRef: React.RefObject<ActionType>;
  onAdd: () => void;
  onView: (record: IndicatorItem) => void;
  onEdit: (record: IndicatorItem) => void;
  onDelete: (id: string) => void;
}

const IndicatorTable: React.FC<IndicatorTableProps> = ({
  actionRef,
  onAdd,
  onView,
  onEdit,
  onDelete,
}) => {
  // 表格列定义
  const columns: any[] = [
    {
      title: '指标编号',
      dataIndex: 'indicatorNo',
      key: 'indicatorNo',
      width: 180,
      search: {
        allowClear: true,
        placeholder: '请输入指标编号',
      },
    },
    {
      title: '指标名称',
      dataIndex: 'indicatorName',
      key: 'indicatorName',
      width: 200,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="topLeft">
            <div
              style={{
                maxWidth: '180px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {text}
            </div>
          </Tooltip>
        );
      },
      search: {
        allowClear: true,
        placeholder: '请输入指标名称',
      },
    },
    {
      title: '指标描述',
      dataIndex: 'indicatorDesc',
      key: 'indicatorDesc',
      width: 150,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="topLeft">
            <div
              style={{
                maxWidth: '140px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {text || '无'}
            </div>
          </Tooltip>
        );
      },
      search: false,
    },
    {
      title: '指标字段',
      dataIndex: 'indicatorField',
      key: 'indicatorField',
      width: 120,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="topLeft">
            <div
              style={{
                maxWidth: '100px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {text}
            </div>
          </Tooltip>
        );
      },
      search: false,
    },
    {
      title: '查询字段',
      dataIndex: 'queryField',
      key: 'queryField',
      width: 120,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="topLeft">
            <div
              style={{
                maxWidth: '100px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {text}
            </div>
          </Tooltip>
        );
      },
      search: false,
    },
    {
      title: '查询编号',
      dataIndex: 'queryNo',
      key: 'queryNo',
      width: 120,
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 200,
      render: (_: any, record: IndicatorItem) => (
        <Space size="middle">
          <a onClick={() => onView(record)}>查看</a>
          <a onClick={() => onEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除这个指标吗？"
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
      <ProTable
        cardBordered
        actionRef={actionRef}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            新增指标
          </Button>,
        ]}
        request={async (params) => {
          // 格式化搜索参数
          const searchParams = {
            ...params,
          };

          const response = await indicatorApi.indicatorPage(searchParams);

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

export default IndicatorTable;
