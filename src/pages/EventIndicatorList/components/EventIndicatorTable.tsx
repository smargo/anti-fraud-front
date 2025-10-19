/**
 * EventIndicatorTable 组件
 */

import React from 'react';
import { ProTable } from '@ant-design/pro-table';
import { Button, Card, Tooltip } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { queryEventIndicatorsWithNames } from '@/services/antifraud/eventIndicator';
import type { EventIndicatorItem } from '../types';

interface EventIndicatorTableProps {
  actionRef: React.RefObject<ActionType>;
  onView: (record: EventIndicatorItem) => void;
}

const EventIndicatorTable: React.FC<EventIndicatorTableProps> = ({
  actionRef,
  onView,
}) => {
  // 表格列定义
  const columns: any[] = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      search: {
        allowClear: true,
        placeholder: '请输入事件编号',
      },
    },
    {
      title: '版本代码',
      dataIndex: 'versionCode',
      key: 'versionCode',
      width: 100,
      search: {
        placeholder: '请输入版本代码',
        allowClear: true,
      },
    },
    {
      title: '事件名称',
      dataIndex: 'eventName',
      key: 'eventName',
      width: 200,
      ellipsis: true,
      render: (text: any) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || '无'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '指标编号',
      dataIndex: 'indicatorNo',
      key: 'indicatorNo',
      width: 150,
      ellipsis: true,
      render: (text: any) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || '无'}
          </div>
        </Tooltip>
      ),
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
      render: (text: any) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || '无'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 80,
      fixed: 'right',
      render: (_: any, record: EventIndicatorItem) => (
        <Button 
          type="link" 
          onClick={() => onView(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <ProTable
        cardBordered
        actionRef={actionRef}
        toolBarRender={() => []}
        request={async (params) => {
          // 格式化搜索参数
          const searchParams = {
            ...params,
          };
          
          const response = await queryEventIndicatorsWithNames(searchParams);
          // 如果返回的是分页对象，直接返回
          return {
            data: response.records || response.data || [],
            total: response.total,
            success: true,
          };
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

export default EventIndicatorTable;

