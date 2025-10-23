/**
 * StatementDependencyTable 组件
 */

import { queryStatementDependenciesWithNames } from '@/services/antifraud/statementDependency';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-table';
import { Button, Card, Tooltip } from 'antd';
import React from 'react';
import type { StatementDependencyItem } from '../types';

interface StatementDependencyTableProps {
  actionRef: React.RefObject<ActionType>;
  onView: (record: StatementDependencyItem) => void;
}

const StatementDependencyTable: React.FC<StatementDependencyTableProps> = ({
  actionRef,
  onView,
}) => {
  // 表格列定义
  const columns: any[] = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 100,
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
      title: '语句编号',
      dataIndex: 'statementNo',
      key: 'statementNo',
      width: 120,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div
            style={{
              maxWidth: '100px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {text || '无'}
          </div>
        </Tooltip>
      ),
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
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div
            style={{
              maxWidth: '130px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {text || '无'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '依赖语句编号',
      dataIndex: 'dependStatementNo',
      key: 'dependStatementNo',
      width: 120,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {text || '无'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '依赖语句描述',
      dataIndex: 'dependStatementDesc',
      key: 'dependStatementDesc',
      width: 150,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div
            style={{
              maxWidth: '130px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
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
      render: (_: any, record: StatementDependencyItem) => (
        <Button type="link" onClick={() => onView(record)}>
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

          const response = await queryStatementDependenciesWithNames(searchParams);
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

export default StatementDependencyTable;
