/**
 * 版本历史弹窗组件
 */

import React from 'react';
import { Modal, ProTable, Button, Space, Tag, Popconfirm, message } from 'antd';
import { EyeOutlined, CopyOutlined, RollbackOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import moment from 'moment';
import { rollbackToVersion } from '../../services/eventConfigApi';
import type { EventConfigVersion, VersionHistoryModalProps } from '../../types';

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  visible,
  eventNo,
  versionHistory,
  actionRef,
  onCancel,
  onCopyVersion,
}) => {
  // 回滚到指定版本
  const handleRollback = async (versionId: string) => {
    try {
      const response = await rollbackToVersion(eventNo, versionId);
      if (response.code === 'SUCCESS') {
        message.success('回滚版本成功');
        actionRef?.current?.reload();
      } else {
        message.error(response.message || '回滚版本失败');
      }
    } catch (error) {
      message.error('回滚版本失败');
    }
  };

  // 表格列定义
  const columns: ProColumns<EventConfigVersion>[] = [
    {
      title: '版本代码',
      dataIndex: 'versionCode',
      key: 'versionCode',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          DRAFT: { color: 'orange', text: '草稿' },
          ACTIVE: { color: 'green', text: '生效' },
          APPROVED: { color: 'blue', text: '已审批' },
          ARCHIVED: { color: 'gray', text: '已归档' },
        };
        const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '事件类型',
      dataIndex: 'eventType',
      key: 'eventType',
      width: 120,
    },
    {
      title: '事件分组',
      dataIndex: 'eventGroup',
      key: 'eventGroup',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => {
              // 查看版本详情
              console.log('查看版本详情:', record);
            }}
          >
            查看
          </Button>
          <Button 
            type="link" 
            icon={<CopyOutlined />}
            onClick={() => onCopyVersion(record)}
          >
            复制
          </Button>
          {record.status !== 'ACTIVE' && (
            <Popconfirm
              title="确定要回滚到这个版本吗？"
              onConfirm={() => handleRollback(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="link" 
                icon={<RollbackOutlined />}
                danger
              >
                回滚
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="版本历史"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <ProTable<EventConfigVersion>
        actionRef={actionRef}
        columns={columns}
        dataSource={versionHistory}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        search={false}
        toolBarRender={() => []}
      />
    </Modal>
  );
};

export default VersionHistoryModal;
