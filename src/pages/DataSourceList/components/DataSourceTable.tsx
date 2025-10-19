/**
 * DataSourceTable 组件
 */

import React from 'react';
import { ProTable } from '@ant-design/pro-table';
import { Button, Space, Tooltip, Popconfirm } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { getDictText, convertDictToValueEnum, type DictItem } from '@/utils/dictUtils';
import { fetchDataSourceList } from '../helper';
import type { DataSourceItem } from '../types';
import moment from 'moment';

interface DataSourceTableProps {
  actionRef: React.RefObject<ActionType>;
  dataSourceTypeOptions: DictItem[];
  onAdd: () => void;
  onView: (record: DataSourceItem) => void;
  onEdit: (record: DataSourceItem) => void;
  onDelete: (dataSourceNo: string) => void;
  isProtectedDataSource: (dataSourceNo: string) => boolean;
}

const DataSourceTable: React.FC<DataSourceTableProps> = ({
  actionRef,
  dataSourceTypeOptions,
  onAdd,
  onView,
  onEdit,
  onDelete,
  isProtectedDataSource,
}) => {
  // 表格列定义
  const columns: ProColumns<DataSourceItem>[] = [
    {
      title: '数据源编号',
      dataIndex: 'dataSourceNo',
      key: 'dataSourceNo',
      width: 120,
      search: true,
    },
    {
      title: '数据源名称',
      dataIndex: 'dataSourceName',
      key: 'dataSourceName',
      width: 150,
      ellipsis: true,
      render: (_: any, record: DataSourceItem) => {
        const text = record.dataSourceName;
        return (
          <Tooltip placement="topLeft" title={text || '-'}>
            <div style={{ 
              maxWidth: '120px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {text || '-'}
            </div>
          </Tooltip>
        );
      },
      search: true,
    },
    {
      title: '数据源类型',
      dataIndex: 'dataSourceType',
      key: 'dataSourceType',
      width: 100,
      render: (_: any, record: DataSourceItem) => {
        return getDictText(dataSourceTypeOptions, record.dataSourceType);
      },
      search: true,
      valueType: 'select',
      valueEnum: convertDictToValueEnum(dataSourceTypeOptions),
    },
    {
      title: '用户名',
      dataIndex: 'dataSourceUserName',
      key: 'dataSourceUserName',
      width: 120,
      hideInSearch: true,
      render: (_, record: DataSourceItem) => record.dataSourceUserName || '-',
    },
    {
      title: '连接字符串',
      dataIndex: 'dataSourceConnectString',
      key: 'dataSourceConnectString',
      width: 200,
      search: false,
      ellipsis: true,
      render: (_: any, record: DataSourceItem) => {
        const connectString = record.dataSourceConnectString;
        return (
          <Tooltip placement="topLeft" title={connectString || '-'}>
            <div style={{ 
              maxWidth: '270px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              {connectString || '-'}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 160,
      search: false,
      render: (_: any, record: DataSourceItem) => moment(record.createdDate).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 120,
      hideInDescriptions: true,
      render: (_: any, record: DataSourceItem) => {
        const isProtected = isProtectedDataSource(record.dataSourceNo);
        return (
          <Space size="middle">
            <a onClick={() => onView(record)}>查看</a>
            {isProtected ? (
              <Tooltip title="受保护的默认数据源不允许修改">
                <a style={{ color: '#ccc', cursor: 'not-allowed' }}>编辑</a>
              </Tooltip>
            ) : (
              <a onClick={() => onEdit(record)}>编辑</a>
            )}
            {isProtected ? (
              <Tooltip title="受保护的默认数据源不允许删除">
                <a style={{ color: '#ccc', cursor: 'not-allowed' }}>删除</a>
              </Tooltip>
            ) : (
              <Popconfirm
                title="确定要删除这个数据源吗？"
                onConfirm={() => onDelete(record.dataSourceNo)}
                okText="确定"
                cancelText="取消"
              >
                <a style={{ color: 'red' }}>删除</a>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <ProTable<DataSourceItem, any>
      actionRef={actionRef}
      rowKey="dataSourceNo"
      scroll={{ x: 1200, y: 490 }}
      columns={columns}
      request={fetchDataSourceList}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`,
      }}
      search={{ labelWidth: 100, showHiddenNum: true }}
      toolBarRender={() => [
        <Button type="primary" onClick={onAdd} icon={<PlusOutlined />}>
          新增数据源
        </Button>,
      ]}
    />
  );
};

export default DataSourceTable;

