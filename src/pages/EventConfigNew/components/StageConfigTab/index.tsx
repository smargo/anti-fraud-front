/**
 * 阶段配置Tab组件 - 完全按照原页面逻辑实现
 */

import { StageItem } from '@/pages/StageList/types';
import { convertDictToValueEnum, getDictText } from '@/utils/dictUtils';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space, Tooltip } from 'antd';
import moment from 'moment';
import React from 'react';
import { deleteStage, queryStages } from '../../services/stageConfigApi';
import type { StageConfigTabProps } from '../../types';
import StageModal from './StageModal';
import StageViewModal from './StageViewModal';

const StageConfigTab: React.FC<StageConfigTabProps> = ({
  eventNo,
  versionCode,
  isReadOnly,
  eventStageOptions,
  stageBeanOptions,
  actionRef,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingStage, setEditingStage] = React.useState<StageItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = React.useState(false);
  const [viewingStage, setViewingStage] = React.useState<StageItem | null>(null);

  // 阶段列定义 - 完全按照原页面
  const stageColumns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      search: false,
    },
    {
      title: '阶段编号',
      dataIndex: 'stageNo',
      key: 'stageNo',
      width: 80,
      render: (stage: string) => {
        return getDictText(eventStageOptions, stage);
      },
      search: {
        valueType: 'select',
        valueEnum: convertDictToValueEnum(eventStageOptions),
        placeholder: '请选择阶段编号',
        allowClear: true,
      },
    },
    {
      title: '阶段名称',
      dataIndex: 'stageName',
      key: 'stageName',
      width: 150,
      search: false,
    },
    {
      title: '阶段组件',
      dataIndex: 'stageBean',
      key: 'stageBean',
      width: 200,
      ellipsis: true,
      render: (_, record: StageItem) => {
        const bean = record.stageBean;
        const beanStr = String(bean || '');
        const dictText = getDictText(stageBeanOptions, beanStr);
        const displayText = dictText ? `${beanStr}-${dictText}` : beanStr || '-';
        return (
          <Tooltip title={displayText} placement="topLeft">
            <span
              style={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayText}
            </span>
          </Tooltip>
        );
      },
      search: false,
    },
    {
      title: '阶段参数',
      dataIndex: 'stageParam',
      key: 'stageParam',
      width: 150,
      render: (statementNo: string) => statementNo || '-',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 170,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: StageItem) => (
        <Space size="middle">
          <a onClick={() => handleStageView(record)}>查看</a>
          <a
            onClick={isReadOnly ? undefined : () => handleStageEdit(record)}
            style={{ color: isReadOnly ? '#ccc' : undefined }}
          >
            编辑
          </a>
          <Popconfirm
            title="确定要删除这个阶段吗？"
            onConfirm={() => handleStageDelete(record.id)}
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
                      console.log('开始删除阶段');
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

  // 阶段相关处理
  const handleStageAdd = () => {
    setEditingStage(null);
    setModalVisible(true);
  };

  const handleStageEdit = (record: StageItem) => {
    setEditingStage(record);
    setModalVisible(true);
  };

  const handleStageDelete = async (id: string) => {
    try {
      const response = await deleteStage(id);
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

  const handleStageSubmit = async (values: any) => {
    setModalVisible(false);
    actionRef?.current?.reload();
  };

  const handleStageViewCancel = () => {
    setViewModalVisible(false);
    setViewingStage(null);
  };

  // 阶段查看处理
  const handleStageView = (record: StageItem) => {
    setViewingStage(record);
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
            columns={stageColumns}
            request={async (params) => {
              const response = await queryStages({
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
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            scroll={{ x: 1200 }}
            toolBarRender={() => [
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleStageAdd}
                key="add"
                disabled={isReadOnly}
              >
                新增阶段
              </Button>,
            ]}
          />
        </>
      )}

      {/* 阶段编辑Modal */}
      <StageModal
        visible={modalVisible}
        editingStage={editingStage}
        eventNo={eventNo}
        versionCode={versionCode}
        eventStageOptions={eventStageOptions}
        stageBeanOptions={stageBeanOptions}
        forceReset={!editingStage}
        onSubmit={handleStageSubmit}
        onCancel={() => setModalVisible(false)}
      />

      {/* 阶段查看Modal */}
      <StageViewModal
        visible={viewModalVisible}
        viewingStage={viewingStage}
        eventStageOptions={eventStageOptions}
        stageBeanOptions={stageBeanOptions}
        onCancel={handleStageViewCancel}
      />
    </div>
  );
};

export default StageConfigTab;
