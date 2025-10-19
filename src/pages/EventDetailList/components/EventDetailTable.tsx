/**
 * EventDetailTable 组件
 */

import React from 'react';
import { ProTable } from '@ant-design/pro-table';
import { Button, Space, Tag, Tooltip } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { getDictText, convertDictToValueEnum, type DictItem } from '@/utils/dictUtils';
import { formatDateTime, formatProcessTime } from '../helper';
import { fetchEventDetailList } from '../helper';
import type { EventDetailItem } from '../types';

interface EventDetailTableProps {
  actionRef: React.RefObject<ActionType>;
  eventTypeOptions: DictItem[];
  statusOptions: DictItem[];
  resultOptions: DictItem[];
  eventTypeValueEnum: any;
  statusValueEnum: any;
  resultValueEnum: any;
  onAdd: () => void;
  onView: (record: EventDetailItem) => void;
  onEdit: (record: EventDetailItem) => void;
  onDelete: (id: string) => void;
}

const EventDetailTable: React.FC<EventDetailTableProps> = ({
  actionRef,
  eventTypeOptions,
  statusOptions,
  resultOptions,
  eventTypeValueEnum,
  statusValueEnum,
  resultValueEnum,
  onAdd,
  onView,
  onEdit,
  onDelete,
}) => {
  // 表格列定义
  const columns: any[] = [
    {
      title: '事件流水号',
      dataIndex: 'eventTransNo',
      key: 'eventTransNo',
      width: 200,
      ellipsis: true,
    },
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
    },
    {
      title: '事件类型',
      dataIndex: 'eventType',
      key: 'eventType',
      width: 100,
      valueEnum: eventTypeValueEnum,
      render: (_: any, record: EventDetailItem) => {
        return getDictText(eventTypeOptions, record.eventType);
      },
    },
    {
      title: '事件来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
    },
    {
      title: '事件时间',
      dataIndex: 'eventTime',
      key: 'eventTime',
      search: false,
      width: 160,
      render: (_: any, record: EventDetailItem) => formatDateTime(record.eventTime),
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      valueEnum: statusValueEnum,
      render: (_: any, record: EventDetailItem) => {
        const option = statusOptions.find(opt => opt.itemNo === record.status);
        const text = option ? option.itemDescribe : record.status;
        const color = option?.listClass || 'default';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '处理结果',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      valueEnum: resultValueEnum,
      render: (_: any, record: EventDetailItem) => {
        const option = resultOptions.find(opt => opt.itemNo === record.result);
        const text = option ? option.itemDescribe : record.result;
        const color = option?.listClass || 'default';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '处理时间(ms)',
      dataIndex: 'processTime',
      key: 'processTime',
      search: false,
      width: 120,
      render: (_: any, record: EventDetailItem) => record.processTime,
    },
    {
      title: '重试次数',
      dataIndex: 'retryCount',
      key: 'retryCount',
      search: false,
      width: 100,
    },
    {
      title: '错误信息',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      search: false,
      width: 200,
      ellipsis: true,
      render: (errorText: string) => {
        return (
          <Tooltip placement="topLeft">
            <span style={{ 
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {errorText}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      search: false,
      width: 160,
      render: (_: any, record: EventDetailItem) => formatDateTime(record.createdDate),
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: EventDetailItem) => (
        <Space size="middle">
          <a onClick={() => onView(record)}>查看</a>
          <a onClick={() => onEdit(record)}>编辑</a>
        </Space>
      ),
    },
  ];

  return (
    <ProTable<EventDetailItem, any>
      actionRef={actionRef}
      toolBarRender={() => [
        // 隐藏新增按钮，但保留代码以备将来使用
        // <Button
        //   key="add"
        //   type="primary"
        //   icon={<PlusOutlined />}
        //   onClick={onAdd}
        // >
        //   新增
        // </Button>,
      ]}
      request={async (params) => {
        const response = await fetchEventDetailList(params);
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
      scroll={{ x: 1600 }}
      options={{
        reload: true,
        density: true,
        fullScreen: true,
      }}
    />
  );
};

export default EventDetailTable;
