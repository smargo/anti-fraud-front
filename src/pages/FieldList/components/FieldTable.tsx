/**
 * FieldTable 组件
 */

import React from 'react';
import { ProTable } from '@ant-design/pro-table';
import { Button, Card, Tooltip } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { getDictText, convertDictToValueEnum, type DictItem } from '@/utils/dictUtils';
import moment from 'moment';
import { queryEventFields } from '@/services/antifraud/field';
import type { FieldItem } from '../types';

interface FieldTableProps {
  actionRef: React.RefObject<ActionType>;
  fieldTypeOptions: DictItem[];
  onView: (record: FieldItem) => void;
}

const FieldTable: React.FC<FieldTableProps> = ({
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
      width: 150,
      search: {
        placeholder: '请输入事件编号',
        allowClear: true,
      },
    },
    {
      title: '版本代码',
      dataIndex: 'versionCode',
      key: 'versionCode',
      width: 80,
      search: {
        placeholder: '请输入版本代码',
        allowClear: true,
      },
    },
    {
      title: '字段名称',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 120,
      search: {
        placeholder: '请输入字段名称',
        allowClear: true,
      },
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      key: 'fieldType',
      width: 80,
      render: (fieldType: string) => {
        return getDictText(fieldTypeOptions, fieldType);
      },
      search: {
        valueType: 'select',
        valueEnum: convertDictToValueEnum(fieldTypeOptions),
        placeholder: '请选择字段类型',
        allowClear: true,
      },
    },
    {
      title: '字段描述',
      dataIndex: 'fieldDesc',
      key: 'fieldDesc',
      width: 150,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            maxWidth: '150px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || '无描述'}
          </div>
        </Tooltip>
      ),
      search: true,
    },
    {
      title: '验证脚本',
      dataIndex: 'validateScript',
      key: 'validateScript',
      width: 150,
      ellipsis: true,
      render: (script: string) => (
        <Tooltip  
          placement="topLeft"
        >
          <div style={{ 
            maxWidth: '150px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            {script || '无验证脚本'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 160,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 100,
      render: (_: any, record: FieldItem) => (
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
      <ProTable<FieldItem, any>
        cardBordered
        actionRef={actionRef}
        toolBarRender={() => []}
        request={async (params) => {
          // 格式化搜索参数
          const searchParams = {
            ...params,
          };
          
          const response = await queryEventFields(searchParams);
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

export default FieldTable;

