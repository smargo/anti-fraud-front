/**
 * 语句依赖配置Tab组件
 */

import { StatementDependencyItem } from '@/pages/StatementDependencyList/types';
import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-table';
import { Button, Card, Popconfirm, Space, Tooltip } from 'antd';
import moment from 'moment';
import React from 'react';
import { useStatementDependencyConfig } from '../../hooks/useStatementDependencyConfig';
import type { StatementDependencyConfigTabProps } from '../../types';
import StatementDependencyModal from './StatementDependencyModal';
import StatementDependencyViewModal from './StatementDependencyViewModal';

const StatementDependencyConfigTab: React.FC<StatementDependencyConfigTabProps> = ({
  eventNo,
  versionCode,
  isReadOnly,
  actionRef,
}) => {
  const {
    statementDependencies,
    loading,
    modalVisible,
    editingStatementDependency,
    viewModalVisible,
    viewingStatementDependency,
    forceReset,
    loadStatementDependencies,
    handleCreateStatementDependency,
    handleUpdateStatementDependency,
    handleDeleteStatementDependency,
    showCreateModal,
    showEditModal,
    showViewModal,
    closeModal,
    closeViewModal,
  } = useStatementDependencyConfig(eventNo, versionCode, actionRef);

  // 表格列定义 - 完全按照原页面逻辑
  const columns: ProColumns<StatementDependencyItem>[] = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 200,
      search: false,
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
        placeholder: '请输入语句编号',
        allowClear: true,
        labelWidth: 100,
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
        placeholder: '请输入依赖语句编号',
        allowClear: true,
        labelWidth: 280,
      },
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
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
      search: false,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 200,
      render: (_: any, record: StatementDependencyItem) => (
        <Space size="middle">
          <Button type="link" onClick={() => showViewModal(record)}>
            查看
          </Button>
          <a
            onClick={isReadOnly ? undefined : () => showEditModal(record)}
            style={{ color: isReadOnly ? '#ccc' : undefined }}
          >
            编辑
          </a>
          <Popconfirm
            title="确定要删除这个语句依赖吗？"
            onConfirm={() => handleDeleteStatementDependency(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={isReadOnly}
          >
            <a
              style={{ color: isReadOnly ? '#ccc' : 'red' }}
              onClick={
                isReadOnly
                  ? undefined
                  : () => {
                      console.log('删除语句依赖');
                    }
              }
            >
              删除
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <ProTable<StatementDependencyItem>
          actionRef={actionRef}
          columns={columns}
          request={loadStatementDependencies}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          search={{
            labelWidth: 'auto',
            span: 8,
            defaultCollapsed: false,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showCreateModal}
              key="add"
              disabled={isReadOnly}
            >
              新增语句依赖
            </Button>,
          ]}
        />
      </Card>

      {/* 语句依赖编辑弹窗 */}
      <StatementDependencyModal
        visible={modalVisible}
        editingStatementDependency={editingStatementDependency}
        eventNo={eventNo}
        versionCode={versionCode}
        forceReset={forceReset}
        onSubmit={
          editingStatementDependency
            ? handleUpdateStatementDependency
            : handleCreateStatementDependency
        }
        onCancel={closeModal}
      />

      {/* 语句依赖查看弹窗 */}
      <StatementDependencyViewModal
        visible={viewModalVisible}
        viewingStatementDependency={viewingStatementDependency}
        onCancel={closeViewModal}
      />
    </div>
  );
};

export default StatementDependencyConfigTab;
