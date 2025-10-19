/**
 * 字段配置Tab组件
 */

import React from 'react';
import { Card, Button, Space, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { useFieldConfig } from '../../hooks/useFieldConfig';
import FieldModal from './FieldModal';
import FieldViewModal from './FieldViewModal';
import type { FieldItem, FieldConfigTabProps } from '../../types';

const FieldConfigTab: React.FC<FieldConfigTabProps> = ({
  eventNo,
  versionId,
  isReadOnly,
  fieldTypeOptions,
}) => {
  const {
    fields,
    loading,
    modalVisible,
    editingField,
    viewModalVisible,
    viewingField,
    forceReset,
    actionRef,
    loadFields,
    handleCreateField,
    handleUpdateField,
    handleDeleteField,
    showCreateModal,
    showEditModal,
    showViewModal,
    closeModal,
    closeViewModal,
  } = useFieldConfig(eventNo, versionId);

  // 表格列定义
  const columns: ProColumns<FieldItem>[] = [
    {
      title: '字段名称',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 150,
      search: true,
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      key: 'fieldType',
      width: 120,
      search: true,
      render: (fieldType: string) => {
        const option = fieldTypeOptions.find((opt: any) => opt.itemNo === fieldType);
        return option ? option.itemDescribe : fieldType;
      },
    },
    {
      title: '字段描述',
      dataIndex: 'fieldDesc',
      key: 'fieldDesc',
      width: 200,
      ellipsis: true,
      search: false,
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      width: 100,
      render: (required: boolean) => (required ? '是' : '否'),
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
      search: false,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => showViewModal(record)}>
            查看
          </Button>
          {!isReadOnly && (
            <>
              <Button type="link" onClick={() => showEditModal(record)}>
                编辑
              </Button>
              <Popconfirm
                title="确定要删除这个字段吗？"
                onConfirm={() => handleDeleteField(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <ProTable<FieldItem>
          actionRef={actionRef}
          columns={columns}
          request={loadFields}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          search={{ labelWidth: 100 }}
          toolBarRender={() => [
            !isReadOnly && (
              <Button
                key="create"
                type="primary"
                icon={<PlusOutlined />}
                onClick={showCreateModal}
              >
                新增字段
              </Button>
            ),
          ]}
        />
      </Card>

      {/* 字段编辑弹窗 */}
      <FieldModal
        visible={modalVisible}
        editingField={editingField}
        fieldTypeOptions={fieldTypeOptions}
        forceReset={forceReset}
        onSubmit={editingField ? handleUpdateField : handleCreateField}
        onCancel={closeModal}
      />

      {/* 字段查看弹窗 */}
      <FieldViewModal
        visible={viewModalVisible}
        viewingField={viewingField}
        fieldTypeOptions={fieldTypeOptions}
        onCancel={closeViewModal}
      />
    </div>
  );
};

export default FieldConfigTab;
