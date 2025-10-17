import React, { useState } from 'react';
import { Modal, Table, Space, Tag, Button, message, Popconfirm } from 'antd';
import { EventConfigVersion, rollbackToVersion, discardDraft } from '@/services/eventConfigVersion';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

interface VersionHistoryModalProps {
  visible: boolean;
  onCancel: () => void;
  versionHistory: EventConfigVersion[];
  onVersionRollback: (version: EventConfigVersion) => void;
}

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  visible,
  onCancel,
  versionHistory,
  onVersionRollback,
}) => {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleRollback = async (version: EventConfigVersion) => {
    Modal.confirm({
      title: '确认回滚',
      content: `确定要回滚到版本 ${version.version} 吗？这将创建一个新的发布版本。`,
      onOk: async () => {
        setLoading(true);
        try {
          const rollbackVersion = await rollbackToVersion(version.id.toString(), version.eventNo);
          message.success('回滚成功');
          onVersionRollback(rollbackVersion);
          onCancel();
        } catch (error) {
          message.error('回滚失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleDeleteDraft = async (version: EventConfigVersion) => {
    setDeleting(version.id);
    try {
      await discardDraft(version.id.toString());
      message.success('草稿版本已删除');
      // 这里需要通知父组件更新版本历史
      onCancel(); // 关闭模态框，让父组件重新加载数据
    } catch (error: any) {
      message.error(error.message || '删除草稿版本失败');
    } finally {
      setDeleting(null);
    }
  };

  const columns = [
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'version',
      render: (version: string, record: EventConfigVersion) => (
        <Space>
          <Tag color={record.status === 'DRAFT' ? 'orange' : 'blue'}>
            {version}
          </Tag>
          {record.status === 'ACTIVE' && <Tag color="green">当前</Tag>}
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => status === 'DRAFT' ? '草稿' : '发布',
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '发布时间',
      dataIndex: 'publishedDate',
      key: 'publishedDate',
      render: (date: string) => date ? moment(date).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '描述',
      dataIndex: 'versionDesc',
      key: 'versionDesc',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: EventConfigVersion) => (
        <Space>
          {record.status === 'ACTIVE' && (
            <Button 
              size="small" 
              type="primary"
              loading={loading}
              onClick={() => handleRollback(record)}
            >
              回滚
            </Button>
          )}
          {record.status === 'DRAFT' && (
            <Popconfirm
              title="确认删除草稿版本"
              description={
                <div>
                  <p>确定要删除草稿版本 <strong>{record.version}</strong> 吗？</p>
                  <p style={{ color: '#ff4d4f', margin: 0 }}>
                    <ExclamationCircleOutlined /> 删除后将无法恢复，请谨慎操作。
                  </p>
                </div>
              }
              icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              okText="确认删除"
              cancelText="取消"
              okType="danger"
              onConfirm={() => handleDeleteDraft(record)}
              disabled={deleting === record.id}
            >
              <Button 
                size="small" 
                danger
                loading={deleting === record.id}
                icon={<DeleteOutlined />}
              >
                删除
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
      width={800}
      footer={null}
    >
      <Table
        dataSource={versionHistory}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />
    </Modal>
  );
};

export default VersionHistoryModal;