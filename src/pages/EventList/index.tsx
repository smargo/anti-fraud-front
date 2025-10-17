import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-table';
import { Link } from 'umi';
import { Card, Button, Space, Modal, Form, message, Input, Tag, Popconfirm, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { queryEvents, createEvent, updateEvent, updateEventBasicInfo, deleteEvent } from '@/services/event';
import moment from 'moment';
import EventForm from '@/components/EventForm';

const { TextArea } = Input;

interface EventItem {
  id: string;
  eventNo: string;
  eventName: string;
  eventDesc?: string;
  createdDate: string;
  lastModifiedDate: string;
}

const EventList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [forceReset, setForceReset] = useState(false);
  const actionRef = useRef<ActionType>();

  const handleAdd = () => {
    setEditingEvent(null);
    setForceReset(prev => !prev); // 切换 forceReset 值
    setModalVisible(true);
  };

  const handleEdit = (record: EventItem) => {
    setEditingEvent(record);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个事件吗？',
      onOk: async () => {
        try {
          const response = await deleteEvent(id);
          if (response.code === 'SUCCESS') {
            message.success(response.message || '删除成功');
            actionRef.current?.reload();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error: any) {
          // 处理网络错误或其他异常
          if (error.response?.data?.message) {
            message.error(error.response.data.message);
          } else {
            message.error('删除失败：' + (error.message || '未知错误'));
          }
        }
      },
    });
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (editingEvent) {
        // 编辑时只更新事件名称和描述
        const response = await updateEventBasicInfo(editingEvent.id, {
          eventName: values.eventName,
          eventDesc: values.eventDesc
        });
        if (response.code === 'SUCCESS') {
          message.success('更新成功');
        } else {
          message.error(response.message || '更新失败');
        }
      } else {
        const response = await createEvent(values);
        if (response.code === 'SUCCESS') {
          message.success('创建成功');
        } else {
          message.error(response.message || '创建失败');
          return;
        }
      }
      actionRef.current?.reload();
      setModalVisible(false);
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('操作失败：' + (error.message || '未知错误'));
      }
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
      render: (text: string) => <Link to={`/event/config?eventNo=${text}`}>{text}</Link>,
    },
    {
      title: '事件名称',
      dataIndex: 'eventName',
      key: 'eventName',
      width: 200,
    },
    {
      title: '事件描述',
      dataIndex: 'eventDesc',
      key: 'eventDesc',
      width: 300,
      hideInSearch: true,
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
      hideInSearch: true,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastModifiedDate',
      key: 'lastModifiedDate',
      width: 150,
      hideInSearch: true,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 200,
      render: (_: any, record: EventItem) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除这个事件吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        {/* 事件列表表格 */}
        <ProTable
            cardBordered
            actionRef={actionRef}
            // 核心：自定义工具栏（添加“新增”按钮）
            toolBarRender={() => [
              <Button
                  key="add"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
              >
                新增
              </Button>,
            ]}
            
            // 数据请求配置
            request={async (params) => {
              const response = await queryEvents(params);
              return {
                data: response.records,
                total: response.total,
              };
            }}
            
            // 分页组件配置
            pagination={{
              showSizeChanger: true,
              onChange: (page) => console.log(page),
            }}
            
            columns={columns}
            rowKey="id"
        />

        {/* 新增/编辑弹窗 */}
        <Modal
          title={editingEvent ? '编辑事件' : '新增事件'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          <EventForm
            initialValues={editingEvent}
            onSubmit={handleFormSubmit}
            onCancel={() => setModalVisible(false)}
            forceReset={forceReset}
          />
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default EventList;