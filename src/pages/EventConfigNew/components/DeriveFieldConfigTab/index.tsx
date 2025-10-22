/**
 * 衍生字段配置Tab组件 - 完全按照原页面逻辑实现
 */

import React, { useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import { Button, Space, Tooltip, Modal, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { queryDeriveFields, createDeriveField, updateDeriveField, deleteDeriveField } from '../../services/deriveFieldConfigApi';
import { convertDictToValueEnum, getDictText } from '@/utils/dictUtils';
import DeriveFieldModal from './DeriveFieldModal';
import DeriveFieldViewModal from './DeriveFieldViewModal';
import type { DeriveFieldConfigTabProps, DeriveFieldItem } from '../../types';

const DeriveFieldConfigTab: React.FC<DeriveFieldConfigTabProps> = ({
  eventNo,
  versionCode,
  isReadOnly,
  fieldTypeOptions,
  deriveFieldProcessTypeOptions,
  actionRef,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingDeriveField, setEditingDeriveField] = React.useState<DeriveFieldItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = React.useState(false);
  const [viewingDeriveField, setViewingDeriveField] = React.useState<DeriveFieldItem | null>(null);

  // 衍生字段列定义 - 完全按照原页面
  const deriveFieldColumns = [
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
      width: 120,
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      key: 'fieldType',
      width: 90,
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
        <Tooltip>
          <div style={{ 
            maxWidth: '150px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
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
      title: '处理类型',
      dataIndex: 'processType',
      key: 'processType',
      search: false,
      width: 120,
      render: (processType: string) => {
        return getDictText(deriveFieldProcessTypeOptions, processType);
      },
      search: {
        valueType: 'select',
        valueEnum: convertDictToValueEnum(deriveFieldProcessTypeOptions),
        placeholder: '请选择处理类型',
        allowClear: true,
      },
    },
    {
      title: '处理脚本',
      dataIndex: 'processScript',
      key: 'processScript',
      width: 200,
      search: false,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft">
          <div style={{ 
            maxWidth: '200px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text || '-'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '处理Bean',
      dataIndex: 'processBean',
      key: 'processBean',
      search: false,
      width: 120,
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
      render: (_: any, record: DeriveFieldItem) => (
        <Space size="middle">
          <a onClick={() => handleDeriveFieldView(record)}>
            查看
          </a>
          <a 
            onClick={isReadOnly ? undefined : () => handleDeriveFieldEdit(record)}
            style={{ color: isReadOnly ? '#ccc' : undefined }}
          >
            编辑
          </a>
          <Popconfirm
            title="确定要删除这个衍生字段吗？"
            onConfirm={() => handleDeriveFieldDelete(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={isReadOnly}
          >
            <a 
              style={{ color: isReadOnly ? '#ccc' : 'red' }}
              onClick={isReadOnly ? undefined : () => {}}
            >
              删除
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 衍生字段相关处理
  const handleDeriveFieldAdd = () => {
    setEditingDeriveField(null);
    setModalVisible(true);
  };

  const handleDeriveFieldEdit = (record: DeriveFieldItem) => {
    setEditingDeriveField(record);
    setModalVisible(true);
  };

  const handleDeriveFieldDelete = async (id: string) => {
    try {
      const response = await deleteDeriveField(id);
      if (response.code === 'SUCCESS') {
        message.success('删除成功');
        actionRef?.current?.reload();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    }
  };

  const handleDeriveFieldSubmit = async (values: any) => {
    setModalVisible(false);
    actionRef?.current?.reload();
  };

  const handleDeriveFieldViewCancel = () => {
    setViewModalVisible(false);
    setViewingDeriveField(null);
  };

  // 衍生字段查看处理
  const handleDeriveFieldView = (record: DeriveFieldItem) => {
    setViewingDeriveField(record);
    setViewModalVisible(true);
  };

  // 无版本显示
  const NoVersionDisplay = () => (
    <div style={{ 
      marginBottom: 16, 
      padding: 24, 
      background: '#fafafa', 
      borderRadius: 4, 
      textAlign: 'center',
      border: '1px dashed #d9d9d9'
    }}>
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 16, color: '#666' }}>该事件暂无配置版本</span>
      </div>
      <div style={{ color: '#999' }}>
        请先创建版本，然后开始配置事件信息
      </div>
    </div>
  );

  // 版本信息显示 - 原页面返回null，不显示版本信息
  const VersionInfoDisplay = () => null;

  // 无版本选择显示
  const NoVersionSelectedDisplay = () => (
    <div style={{ 
      marginBottom: 16, 
      padding: 24, 
      background: '#fafafa', 
      borderRadius: 4, 
      textAlign: 'center',
      border: '1px dashed #d9d9d9'
    }}>
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 16, color: '#666' }}>请先选择一个版本进行编辑</span>
      </div>
      <div style={{ color: '#999' }}>
        在版本控制面板中选择要编辑的版本
      </div>
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
            columns={deriveFieldColumns}
            request={async (params) => {
              const response = await queryDeriveFields({
                ...params,
                eventNo: eventNo,
                versionCode: versionCode,
              });
              return {
                data: response.records || response.data || [],
                total: response.total || 0,
                success: true,
              };
            }}
            rowKey="id"
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            scroll={{ x: 1200 }}
            toolBarRender={() => [
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleDeriveFieldAdd} 
                key="add"
                disabled={isReadOnly}
              >
                新增衍生字段
              </Button>,
            ]}
          />
        </>
      )}

      {/* 衍生字段编辑Modal */}
      <DeriveFieldModal
        visible={modalVisible}
        editingDeriveField={editingDeriveField}
        fieldTypeOptions={fieldTypeOptions}
        deriveFieldProcessTypeOptions={deriveFieldProcessTypeOptions}
        forceReset={!editingDeriveField}
        onSubmit={handleDeriveFieldSubmit}
        onCancel={() => setModalVisible(false)}
      />

      {/* 衍生字段查看Modal */}
      <DeriveFieldViewModal
        visible={viewModalVisible}
        viewingDeriveField={viewingDeriveField}
        fieldTypeOptions={fieldTypeOptions}
        deriveFieldProcessTypeOptions={deriveFieldProcessTypeOptions}
        onCancel={handleDeriveFieldViewCancel}
      />
    </div>
  );
};

export default DeriveFieldConfigTab;