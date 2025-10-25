/**
 * 字段配置Tab组件 - 完全按照原页面逻辑实现
 */

import { FieldItem } from '@/pages/FieldList/types';
import { convertDictToValueEnum, getDictText } from '@/utils/dictUtils';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space, Tooltip } from 'antd';
import moment from 'moment';
import React from 'react';
import { deleteEventField, queryEventFields } from '../../services/fieldConfigApi';
import type { FieldConfigTabProps } from '../../types';
import FieldModal from './FieldModal';
import FieldViewModal from './FieldViewModal';

const FieldConfigTab: React.FC<FieldConfigTabProps> = ({
  eventNo,
  versionCode,
  isReadOnly,
  fieldTypeOptions,
  actionRef,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingField, setEditingField] = React.useState<FieldItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = React.useState(false);
  const [viewingField, setViewingField] = React.useState<FieldItem | null>(null);

  // 字段列定义 - 完全按照原页面
  const fieldColumns: any[] = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      search: false,
    },
    {
      title: '字段名称',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 150,
      search: {
        placeholder: '请输入字段名称',
        allowClear: true,
      },
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      key: 'fieldType',
      width: 120,
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
          <div
            style={{
              maxWidth: '150px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {text || '-'}
          </div>
        </Tooltip>
      ),
      search: {
        placeholder: '请输入字段描述',
        allowClear: true,
      },
    },
    {
      title: '校验脚本',
      dataIndex: 'validateScript',
      key: 'validateScript',
      width: 150,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div
            style={{
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {text || '-'}
          </div>
        </Tooltip>
      ),
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      search: false,
      width: 160,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      search: false,
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: FieldItem) => (
        <Space size="middle">
          <a onClick={() => handleFieldView(record)}>查看</a>
          <a
            onClick={isReadOnly ? undefined : () => handleFieldEdit(record)}
            style={{ color: isReadOnly ? '#ccc' : undefined }}
          >
            编辑
          </a>
          <Popconfirm
            title="确定要删除这个字段吗？"
            onConfirm={() => handleFieldDelete(record.id)}
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
                      console.log('开始删除字段');
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

  // 字段相关处理
  const handleFieldAdd = () => {
    setEditingField(null);
    setModalVisible(true);
  };

  const handleFieldEdit = (record: FieldItem) => {
    setEditingField(record);
    setModalVisible(true);
  };

  const handleFieldDelete = async (id: string) => {
    try {
      const response = await deleteEventField(id);
      if (response.code === '0') {
        message.success('删除成功');
        actionRef?.current?.reload();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    }
  };

  const handleFieldSubmit = async (values: any) => {
    setModalVisible(false);
    actionRef?.current?.reload();
  };

  const handleFieldViewCancel = () => {
    setViewModalVisible(false);
    setViewingField(null);
  };

  // 字段查看处理
  const handleFieldView = (record: FieldItem) => {
    setViewingField(record);
    setViewModalVisible(true);
  };

  // 无版本显示
  const NoVersionDisplay = () => (
    <div
      style={{
        marginBottom: 16,
        padding: 24,
        background: '#fafafa',
        borderRadius: 4,
        textAlign: 'center',
        border: '1px dashed #d9d9d9',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 16, color: '#666' }}>该事件暂无配置版本</span>
      </div>
      <div style={{ color: '#999' }}>请先创建版本，然后开始配置事件信息</div>
    </div>
  );

  // 版本信息显示 - 原页面返回null，不显示版本信息
  const VersionInfoDisplay = () => null;

  // 无版本选择显示
  const NoVersionSelectedDisplay = () => (
    <div
      style={{
        marginBottom: 16,
        padding: 24,
        background: '#fafafa',
        borderRadius: 4,
        textAlign: 'center',
        border: '1px dashed #d9d9d9',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 16, color: '#666' }}>请先选择一个版本进行编辑</span>
      </div>
      <div style={{ color: '#999' }}>在版本控制面板中选择要编辑的版本</div>
    </div>
  );

  // 检查是否应该显示编辑界面 - 完全按照原页面逻辑
  const showEditInterface = versionCode && versionCode.length > 0;

  return (
    <div>
      {/* 根据状态显示不同的界面 - 完全按照原页面逻辑 */}
      {!versionCode ? (
        <NoVersionDisplay />
      ) : !showEditInterface ? (
        <>
          <VersionInfoDisplay />
          <NoVersionSelectedDisplay />
        </>
      ) : (
        <>
          <VersionInfoDisplay />
          <ProTable
            actionRef={actionRef}
            columns={fieldColumns}
            request={async (params) => {
              const response = await queryEventFields({
                ...params,
                eventNo: eventNo,
                versionCode: versionCode,
              });
              return response;
            }}
            rowKey="id"
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total: number) => `共 ${total} 条记录`,
            }}
            toolBarRender={() => [
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleFieldAdd}
                key="add"
                disabled={isReadOnly}
              >
                新增字段
              </Button>,
            ]}
          />
        </>
      )}

      {/* 字段编辑Modal */}
      <FieldModal
        visible={modalVisible}
        editingField={editingField}
        eventNo={eventNo}
        versionCode={versionCode || ''}
        fieldTypeOptions={fieldTypeOptions}
        forceReset={!editingField}
        onSubmit={handleFieldSubmit}
        onCancel={() => setModalVisible(false)}
      />

      {/* 字段查看Modal */}
      <FieldViewModal
        visible={viewModalVisible}
        viewingField={viewingField}
        fieldTypeOptions={fieldTypeOptions}
        onCancel={handleFieldViewCancel}
      />
    </div>
  );
};

export default FieldConfigTab;
