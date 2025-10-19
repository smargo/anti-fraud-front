/**
 * EventVersionTable 组件
 */

import React from 'react';
import { ProTable } from '@ant-design/pro-table';
import { Button, Space, Tooltip } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { getDictText, convertDictToValueEnum, type DictItem } from '@/utils/dictUtils';
import moment from 'moment';
import { queryEventVersions, type EventVersionItem } from '@/services/antifraud/eventVersion';

interface EventVersionTableProps {
  actionRef: React.RefObject<ActionType>;
  versionStatusOptions: DictItem[];
  eventTypeOptions: DictItem[];
  eventGroupOptions: DictItem[];
  onView: (record: EventVersionItem) => void;
}

const EventVersionTable: React.FC<EventVersionTableProps> = ({
  actionRef,
  versionStatusOptions,
  eventTypeOptions,
  eventGroupOptions,
  onView,
}) => {
  // 表格列定义
  const columns: any[] = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      hideInSearch: false,
    },
    {
      title: '版本代码',
      dataIndex: 'versionCode',
      key: 'versionCode',
      width: 120,
      hideInSearch: false,
    },
    {
      title: '版本描述',
      dataIndex: 'versionDesc',
      key: 'versionDesc',
      width: 200,
      hideInSearch: false,
      ellipsis: true,
      render: (text: any) => (
        <Tooltip title={text || '-'}>
          <span>{text || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: '事件类型',
      dataIndex: 'eventType',
      key: 'eventType',
      width: 120,
      hideInSearch: false,
      render: (eventType: any) => {
        return getDictText(eventTypeOptions, eventType) || '-';
      },
      valueType: 'select',
      valueEnum: convertDictToValueEnum(eventTypeOptions),
    },
    {
      title: '事件分组',
      dataIndex: 'eventGroup',
      key: 'eventGroup',
      width: 120,
      hideInSearch: true,
      render: (eventGroup: any) => {
        return getDictText(eventGroupOptions, eventGroup) || '-';
      },
      valueType: 'select',
      valueEnum: convertDictToValueEnum(eventGroupOptions),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      hideInSearch: false,
      render: (status: any) => {
        return getDictText(versionStatusOptions, status);
      },
      valueType: 'select',
      valueEnum: convertDictToValueEnum(versionStatusOptions),
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
      hideInSearch: true,
      render: (date: any) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后修改人',
      dataIndex: 'lastModifiedBy',
      key: 'lastModifiedBy',
      width: 100,
      hideInSearch: true,
      render: (text: any) => text || '-',
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastModifiedDate',
      key: 'lastModifiedDate',
      width: 150,
      hideInSearch: true,
      render: (date: any) => date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: EventVersionItem) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            onClick={() => onView(record)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ProTable<EventVersionItem, any>
      actionRef={actionRef}
      columns={columns}
      request={async (params) => {
        const response = await queryEventVersions(params);
        return response;
      }}
      rowKey="id"
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`,
      }}
      search={{
        labelWidth: 'auto',
        span: 8,
        defaultCollapsed: true,
      }}
      scroll={{ x: 1400 }}
      options={{
        reload: true,
        density: true,
        fullScreen: true,
      }}
    />
  );
};

export default EventVersionTable;
