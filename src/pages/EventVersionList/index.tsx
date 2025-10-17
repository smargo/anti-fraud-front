import React, { useState, useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space,Modal, Descriptions, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { queryEventVersions, EventVersionItem } from '@/services/eventVersion';
import { useDictData } from '@/hooks/useDictData';
import {convertDictToValueEnum, getDictText} from '@/utils/dictUtils';

const EventVersionList: React.FC = () => {
  const actionRef = useRef<any>();
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingVersion, setViewingVersion] = useState<EventVersionItem | null>(null);

  // 使用字典数据
  const { getDictOptions } = useDictData(['version_status_option', 'event_type_option', 'event_group_option']);
  const versionStatusOptions = getDictOptions('version_status_option');
  const eventTypeOptions = getDictOptions('event_type_option');
  const eventGroupOptions = getDictOptions('event_group_option');

  // 查看版本详情
  const handleView = (record: EventVersionItem) => {
    setViewingVersion(record);
    setViewModalVisible(true);
  };


  // 表格列定义
  const columns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      hideInSearch: false,
    },
    {
      title: '版本代码',
      dataIndex: 'versionCode',
      key: 'versionCode',
      width: 120,
      hideInSearch: false,
    },
    {
      title: '版本描述',
      dataIndex: 'versionDesc',
      key: 'versionDesc',
      width: 200,
      hideInSearch: false,
      ellipsis: true,
      render: (text: any) => (
        <Tooltip>
          <span>{text || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: '事件类型',
      dataIndex: 'eventType',
      key: 'eventType',
      width: 120,
      hideInSearch: false,
      render: (eventType: any) => {
        return getDictText(eventTypeOptions, eventType) || '-';
      },
      valueType: 'select',
      valueEnum: convertDictToValueEnum(eventTypeOptions),
    },
    {
      title: '事件分组',
      dataIndex: 'eventGroup',
      key: 'eventGroup',
      width: 120,
      hideInSearch: true,
      render: (eventType: any) => {
        return getDictText(eventGroupOptions, eventType) || '-';
      },
      valueType: 'select',
      valueEnum: convertDictToValueEnum(eventGroupOptions),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      hideInSearch: false,
      render: (status: any) => {
        return getDictText(versionStatusOptions, status);
      },
      valueType: 'select',
      valueEnum: convertDictToValueEnum(versionStatusOptions),
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
      hideInSearch: true,
      valueType: 'dateRange',
      search: {
        transform: (value: any) => ({
          startDate: value[0],
          endDate: value[1],
        }),
      },
      render: (date: any) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后修改人',
      dataIndex: 'lastModifiedBy',
      key: 'lastModifiedBy',
      width: 100,
      hideInSearch: true,
      render: (text: any) => text || '-',
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastModifiedDate',
      key: 'lastModifiedDate',
      width: 150,
      hideInSearch: true,
      render: (date: any) => date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: EventVersionItem) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            onClick={() => handleView(record)}
          >
            查看
          </Button>

        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const response = await queryEventVersions(params);
          return {
            data: response.records || [],
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
        search={{
          labelWidth: 'auto',
          span: 8,
          defaultCollapsed: true,
        }}
        scroll={{ x: 1400 }}
        options={{
          reload: true,
          density: true,
          fullScreen: true,
        }}
      />

      {/* 查看版本详情弹窗 */}
      <Modal
        title="版本详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {viewingVersion && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="事件编号" span={2}>
              {viewingVersion.eventNo}
            </Descriptions.Item>
            <Descriptions.Item label="版本代码">
              {viewingVersion.versionCode}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color="default">
                {getDictText(versionStatusOptions, viewingVersion.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="事件类型">
              {getDictText(eventTypeOptions, viewingVersion.eventType || '') || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="事件分组">
              {getDictText(eventGroupOptions, viewingVersion.eventGroup || '') || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="版本描述" span={2}>
              {viewingVersion.versionDesc || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="创建人">
              {viewingVersion.createdBy}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {moment(viewingVersion.createdDate).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="最后修改人">
              {viewingVersion.lastModifiedBy || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="最后修改时间">
              {viewingVersion.lastModifiedDate 
                ? moment(viewingVersion.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')
                : '-'
              }
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

    </PageContainer>
  );
};

export default EventVersionList;
