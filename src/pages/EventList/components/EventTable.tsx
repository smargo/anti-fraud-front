/**
 * EventTable 组件
 */

import React from 'react';
import { ProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-components';
import {Button, Space, Popconfirm, Tooltip} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'umi';
import moment from 'moment';
import { fetchEventList, handleEventDelete } from '../helper';
import type { EventItem } from '../types';

interface EventTableProps {
  actionRef: React.RefObject<ActionType>;
  onAdd: () => void;
  onEdit: (record: EventItem) => void;
  onDelete: (id: string) => void;
}

const EventTable: React.FC<EventTableProps> = ({
  actionRef,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  // 表格列定义
  const columns: any[] = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      render: (_: any, record: EventItem) => (
        <a onClick={() => navigate(`/event/config?eventNo=${record.eventNo}`)}>
          {record.eventNo}
        </a>
      ),
    },
    {
      title: '事件名称',
      dataIndex: 'eventName',
      key: 'eventName',
      width: 200,
    },
    {
      title: '事件描述',
      dataIndex: 'eventDesc',
      key: 'eventDesc',
      width: 300,
      hideInSearch: true,
      ellipsis: true,
      render: (content: string) => {
        return (
            <Tooltip placement="topLeft">
              <div style={{
                maxWidth: '300px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {content}
              </div>
            </Tooltip>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
      hideInSearch: true,
      render: (_: any, record: EventItem) => moment(record.createdDate).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastModifiedDate',
      key: 'lastModifiedDate',
      width: 150,
      hideInSearch: true,
      render: (_: any, record: EventItem) => moment(record.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 200,
      render: (_: any, record: EventItem) => (
        <Space size="middle">
          <a onClick={() => onEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除这个事件吗？"
            onConfirm={() => handleEventDelete(record.id, () => onDelete(record.id))}
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
    <ProTable<EventItem, any>
      cardBordered
      actionRef={actionRef}
      columns={columns}
      request={async (params) => {
        const response = await fetchEventList(params);
        return response;
      }}
      pagination={{
        showSizeChanger: true,
        onChange: (page) => console.log(page),
      }}
      rowKey="id"
      toolBarRender={() => [
        <Button
          key="add"
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
        >
          新增
        </Button>,
      ]}
    />
  );
};

export default EventTable;

