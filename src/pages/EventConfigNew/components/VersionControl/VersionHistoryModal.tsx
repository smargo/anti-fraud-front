/**
 * 版本历史弹窗组件
 */

import { convertDictToValueEnum, getDictText } from '@/utils/dictUtils';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-table';
import { message, Modal, Space, Tooltip } from 'antd';
import moment from 'moment';
import React from 'react';
import type { EventConfigVersion, VersionHistoryModalProps } from '../../types';

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  visible,
  eventNo,
  versionHistory,
  versionStatusOptions,
  actionRef,
  onCancel,
  onSelectVersion,
  onActivateVersion,
  onCopyVersion,
  onRollbackVersion,
  onDeleteDraftVersion,
  hasDraftVersion,
}) => {
  // 表格列定义 - 完全按照原页面逻辑
  const columns: ProColumns<EventConfigVersion>[] = [
    {
      title: '版本代码',
      dataIndex: 'versionCode',
      key: 'versionCode',
      width: 80,
      search: true,
    },
    {
      title: '版本描述',
      dataIndex: 'versionDesc',
      key: 'versionDesc',
      width: 120,
      search: true,
      ellipsis: true,
      render: (text: any) => (
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
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      search: true,
      valueType: 'select',
      valueEnum: convertDictToValueEnum(versionStatusOptions),
      render: (status: any) => {
        return getDictText(versionStatusOptions, status);
      },
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 80,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 160,
      search: false,
      render: (date: any) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后修改人',
      dataIndex: 'lastModifiedBy',
      key: 'lastModifiedBy',
      width: 90,
      search: false,
      render: (text: any) => text || '-',
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastModifiedDate',
      key: 'lastModifiedDate',
      width: 160,
      search: false,
      render: (date: any) => {
        if (!date) return '-';
        const momentDate = moment(date);
        return momentDate.isValid() ? momentDate.format('YYYY-MM-DD HH:mm:ss') : '-';
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      search: false,
      render: (_: any, record: EventConfigVersion) => (
        <Space>
          <a onClick={() => onSelectVersion(record.id)}>选择</a>
          {(record.status === 'DRAFT' || record.status === 'APPROVED') && (
            <a onClick={() => onActivateVersion(record.id)}>激活</a>
          )}
          {record.status !== 'DRAFT' && !hasDraftVersion() && (
            <a onClick={() => onCopyVersion(record)}>复制</a>
          )}

          {record.status === 'ARCHIVED' && <a onClick={() => onRollbackVersion(record.id)}>回滚</a>}
          {record.status === 'DRAFT' && (
            <a style={{ color: '#ff4d4f' }} onClick={() => onDeleteDraftVersion(record.id)}>
              删除
            </a>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Modal title="版本历史" open={visible} onCancel={onCancel} footer={null} width={1000}>
      <ProTable<any>
        actionRef={actionRef}
        request={async (params: any) => {
          console.log('版本历史表格 request 被调用，参数:', params);
          try {
            const { versionApi } = await import('@/services/antifraud/eventConfigVersion');
            const response = await versionApi.getVersionHistoryPage(eventNo, {
              versionCode: params.versionCode,
              versionDesc: params.versionDesc,
              status: params.status,
              current: params.current || 1,
              pageSize: params.pageSize || 10,
            });
            console.log('版本历史分页查询结果:', response);
            return response;
          } catch (error) {
            console.error('获取版本历史失败:', error);
            message.error('获取版本历史失败');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number) => `共 ${total} 条记录`,
        }}
        search={{
          labelWidth: 'auto',
          span: 8,
          defaultCollapsed: true,
        }}
        toolBarRender={() => []}
      />
    </Modal>
  );
};

export default VersionHistoryModal;
