/**
 * DeriveFieldTable 组件
 */

import { DeriveFieldItem } from '@/pages/DeriveFieldList/types';
import { queryDeriveFields } from '@/services/antifraud/deriveField';
import { convertDictToValueEnum, getDictText, type DictItem } from '@/utils/dictUtils';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-table';
import { Button, Card, Tooltip } from 'antd';
import React from 'react';

interface DeriveFieldTableProps {
  actionRef: React.RefObject<ActionType>;
  fieldTypeOptions: DictItem[];
  onView: (record: DeriveFieldItem) => void;
}

const DeriveFieldTable: React.FC<DeriveFieldTableProps> = ({
  actionRef,
  fieldTypeOptions,
  onView,
}) => {
  // 表格列定义
  const columns: any[] = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      search: true,
    },
    {
      title: '版本代码',
      dataIndex: 'versionCode',
      key: 'versionCode',
      width: 100,
      search: true,
    },
    {
      title: '衍生字段名称',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 150,
      search: true,
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      key: 'fieldType',
      width: 100,
      render: (fieldType: any) => {
        return getDictText(fieldTypeOptions, fieldType);
      },
      valueType: 'select',
      valueEnum: convertDictToValueEnum(fieldTypeOptions),
    },
    {
      title: '字段描述',
      dataIndex: 'fieldDesc',
      key: 'fieldDesc',
      width: 150,
      ellipsis: true,
      render: (text: any) => (
        <Tooltip>
          <span>{text || '-'}</span>
        </Tooltip>
      ),
      search: true,
    },
    {
      title: '处理类型',
      dataIndex: 'processType',
      key: 'processType',
      width: 100,
      ellipsis: true,
      search: false,
    },
    {
      title: '衍生脚本',
      dataIndex: 'processScript',
      key: 'processScript',
      width: 150,
      ellipsis: true,
      render: (script: any) => (
        <Tooltip placement="topLeft">
          <div
            style={{
              maxWidth: '150px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'monospace',
              fontSize: '12px',
            }}
          >
            {script || '无衍生脚本'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '处理类',
      dataIndex: 'processBean',
      key: 'processBean',
      width: 120,
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 80,
      fixed: 'right' as const,
      render: (_: any, record: DeriveFieldItem) => (
        <Button type="link" onClick={() => onView(record)}>
          查看
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <ProTable<DeriveFieldItem, any>
        cardBordered
        actionRef={actionRef}
        toolBarRender={() => []}
        request={async (params) => {
          // 格式化搜索参数
          const searchParams = {
            ...params,
          };

          const response = await queryDeriveFields(searchParams);
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

export default DeriveFieldTable;
