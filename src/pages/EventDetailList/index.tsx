import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-table';
import { Button, Space, Modal, Form, message, Input, Row, Col, Popconfirm, Select, Tag, Descriptions, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { queryEventDetails, deleteEventDetail, createEventDetail, updateEventDetail } from '@/services/eventDetail';
import { useDictData } from '@/hooks/useDictData';
import { convertDictToSelectOptions, getDictText } from '@/utils/dictUtils';
import moment from 'moment';

const { TextArea } = Input;

interface EventDetailItem {
  id: string;
  eventTransNo: string;
  eventNo: string;
  eventType: string;
  source: string;
  content: string;
  eventTime: string;
  status: string;
  result: string;
  rejectCode: string;
  resultContent: string;
  processTime: number;
  errorMessage: string;
  retryCount: number;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

const EventDetailList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDetail, setEditingDetail] = useState<EventDetailItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingDetail, setViewingDetail] = useState<EventDetailItem | null>(null);

  // 使用字典数据
  const { getDictOptions, getDictValueEnum } = useDictData([
    'event_type_option',
    'event_detail_status_option', 
    'event_detail_result_option'
  ]);

  const handleAdd = () => {
    setEditingDetail(null);
    setModalVisible(true);
  };

  const handleEdit = (record: EventDetailItem) => {
    setEditingDetail(record);
    setModalVisible(true);
  };

  const handleView = (record: EventDetailItem) => {
    setViewingDetail(record);
    setViewModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个事件明细吗？',
      onOk: async () => {
        try {
          await deleteEventDetail(id);
          message.success('删除成功');
          actionRef.current?.reload();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (editingDetail) {
        await updateEventDetail({ ...values, id: editingDetail.id });
        message.success('更新成功');
      } else {
        await createEventDetail(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('操作失败');
    }
  };


  // 获取字典数据
  const eventTypeOptions = getDictOptions('event_type_option');
  const statusOptions = getDictOptions('event_detail_status_option');
  const resultOptions = getDictOptions('event_detail_result_option');

  // 获取字典的 valueEnum 格式
  const eventTypeValueEnum = getDictValueEnum('event_type_option');
  const statusValueEnum = getDictValueEnum('event_detail_status_option');
  const resultValueEnum = getDictValueEnum('event_detail_result_option');

  const columns = [
    {
      title: '事件流水号',
      dataIndex: 'eventTransNo',
      key: 'eventTransNo',
      width: 200,
      ellipsis: true,
    },
    {
      title: '事件编号',
      dataIndex: 'eventNo',
      key: 'eventNo',
      width: 120,
    },
    {
      title: '事件类型',
      dataIndex: 'eventType',
      key: 'eventType',
      width: 100,
      valueEnum: eventTypeValueEnum,
      render: (type: any) => {
        return getDictText(eventTypeOptions, type);
      },
    },
    {
      title: '事件来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
    },
    {
      title: '事件时间',
      dataIndex: 'eventTime',
      key: 'eventTime',
      search: false,
      width: 160,
      render: (time: any) => moment(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      valueEnum: statusValueEnum,
      render: (status: any) => {
        const option = statusOptions.find(opt => opt.itemNo === status);
        const text = option ? option.itemDescribe : status;
        const color = option?.listClass || 'default';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '处理结果',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      valueEnum: resultValueEnum,
      render: (result: any) => {
        const option = resultOptions.find(opt => opt.itemNo === result);
        const text = option ? option.itemDescribe : result;
        const color = option?.listClass || 'default';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '处理时间(ms)',
      dataIndex: 'processTime',
      key: 'processTime',
      search: false,
      width: 120,
      render: (time: any) => time || 0,
    },
    {
      title: '重试次数',
      dataIndex: 'retryCount',
      key: 'retryCount',
      search: false,
      width: 100,
    },
    {
      title: '错误信息',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      search: false,
      width: 200,
      ellipsis: true,
      render: (message: any) => {
        const errorText = message || '-';
        return (
          <Tooltip placement="topLeft">
            <span style={{ 
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {errorText}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      search: false,
      width: 160,
      render: (date: any) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: EventDetailItem) => (
        <Space size="middle">
          <a onClick={() => handleView(record)}>查看</a>
          <a onClick={() => handleEdit(record)}>编辑</a>
        </Space>
      ),
    },
  ];

  const actionRef = useRef<ActionType>();
  
  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        toolBarRender={() => [
          // 隐藏新增按钮，但保留代码以备将来使用
          // <Button
          //   key="add"
          //   type="primary"
          //   icon={<PlusOutlined />}
          //   onClick={handleAdd}
          // >
          //   新增
          // </Button>,
        ]}
        request={async (params) => {
          const response = await queryEventDetails(params);
          // 如果返回的是分页对象，直接返回
          return {
            data: response.records|| [],
            total: response.total,
            success: true,
          };
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1600 }}
        options={{
          reload: true,
          density: true,
          fullScreen: true,
        }}
      />

        <Modal
          title={editingDetail ? '编辑事件明细' : '新增事件明细'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          <EventDetailForm
            initialValues={editingDetail}
            onSubmit={handleFormSubmit}
            onCancel={() => setModalVisible(false)}
            eventTypeOptions={eventTypeOptions}
            statusOptions={statusOptions}
            resultOptions={resultOptions}
          />
        </Modal>

        <Modal
          title="查看事件明细"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={1000}
        >
          <EventDetailView
            data={viewingDetail}
            eventTypeOptions={eventTypeOptions}
            statusOptions={statusOptions}
            resultOptions={resultOptions}
          />
        </Modal>
    </PageContainer>
  );
};

interface EventDetailFormProps {
  initialValues?: EventDetailItem | null;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  eventTypeOptions: any[];
  statusOptions: any[];
  resultOptions: any[];
}

interface EventDetailViewProps {
  data?: EventDetailItem | null;
  eventTypeOptions: any[];
  statusOptions: any[];
  resultOptions: any[];
}

const EventDetailForm: React.FC<EventDetailFormProps> = ({ 
  initialValues, 
  onSubmit, 
  onCancel, 
  eventTypeOptions, 
  statusOptions, 
  resultOptions 
}) => {
  const [form] = Form.useForm();

  // 获取字典文本的辅助函数
  const getDictText = (options: any[], itemNo: string) => {
    const option = options.find(opt => opt.itemNo === itemNo);
    return option ? option.itemDescribe : itemNo;
  };

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const isEdit = !!initialValues;

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues || {
        eventStatus: 'SUCCESS',
        retryCount: 0,
        processTime: 0
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="eventNo"
            label="事件编号"
            rules={isEdit ? [] : [{ required: true, message: '请输入事件编号' }]}
          >
            <Input disabled={isEdit} placeholder={isEdit ? '' : '请输入事件编号'} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="eventTransNo"
            label="交易流水号"
            rules={isEdit ? [] : [{ required: true, message: '请输入交易流水号' }]}
          >
            <Input disabled={isEdit} placeholder={isEdit ? '' : '请输入交易流水号'} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="eventType"
            label="事件类型"
            rules={isEdit ? [] : [{ required: true, message: '请选择事件类型' }]}
          >
            <Select 
              placeholder="请选择事件类型"
              disabled={isEdit}
            >
              {convertDictToSelectOptions(eventTypeOptions).map(option => (
                <Select.Option key={option.key} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="source"
            label="事件来源"
            rules={isEdit ? [] : [{ required: true, message: '请输入事件来源' }]}
          >
            <Input disabled={isEdit} placeholder={isEdit ? '' : '请输入事件来源'} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="content"
        label="事件内容"
        rules={isEdit ? [] : [{ required: true, message: '请输入事件内容' }]}
      >
        <TextArea 
          disabled={isEdit} 
          rows={3} 
          placeholder={isEdit ? '' : '请输入事件内容'}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="eventTime"
            label="事件时间"
            rules={isEdit ? [] : [{ required: true, message: '请输入事件时间' }]}
          >
            <Input disabled={isEdit} placeholder={isEdit ? '' : '请输入事件时间'} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="status"
            label="处理状态"
            rules={[{ required: true, message: '请选择处理状态' }]}
          >
            <Select 
              placeholder="请选择处理状态"
              showSearch
              optionFilterProp="children"
            >
              {convertDictToSelectOptions(statusOptions).map(option => (
                <Select.Option key={option.key} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="result"
            label="处理结果"
            rules={isEdit ? [] : [{ required: true, message: '请选择处理结果' }]}
          >
            <Select 
              placeholder="请选择处理结果"
              disabled={isEdit}
            >
              {convertDictToSelectOptions(resultOptions).map(option => (
                <Select.Option key={option.key} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="rejectCode"
            label="拒绝代码"
          >
            <Input disabled={isEdit} placeholder={isEdit ? '' : '请输入拒绝代码（可选）'} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="resultContent"
        label="结果内容"
      >
        <TextArea 
          disabled={isEdit} 
          rows={3} 
          placeholder={isEdit ? '' : '请输入结果内容（可选）'}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="processTime"
            label="处理时间(ms)"
            rules={isEdit ? [] : [{ required: true, message: '请输入处理时间' }]}
          >
            <Input 
              disabled={isEdit} 
              type="number" 
              placeholder={isEdit ? '' : '请输入处理时间'}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="retryCount"
            label="重试次数"
            rules={isEdit ? [] : [{ required: true, message: '请输入重试次数' }]}
          >
            <Input 
              disabled={isEdit} 
              type="number" 
              placeholder={isEdit ? '' : '请输入重试次数'}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="errorMessage"
        label="错误信息"
      >
        <TextArea 
          disabled={isEdit} 
          rows={2} 
          placeholder={isEdit ? '' : '请输入错误信息（可选）'}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" onClick={handleSubmit}>
            {isEdit ? '更新状态' : '创建'}
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

const EventDetailView: React.FC<EventDetailViewProps> = ({ 
  data, 
  eventTypeOptions, 
  statusOptions, 
  resultOptions 
}) => {
  if (!data) {
    return <div>暂无数据</div>;
  }

  const getDictText = (options: any[], itemNo: string) => {
    const option = options.find(opt => opt.itemNo === itemNo);
    return option ? option.itemDescribe : itemNo;
  };

  return (
    <Descriptions column={2} bordered>
      <Descriptions.Item label="事件流水号" span={2}>
        {data.eventTransNo}
      </Descriptions.Item>
      <Descriptions.Item label="事件编号">
        {data.eventNo}
      </Descriptions.Item>
      <Descriptions.Item label="事件类型">
        {getDictText(eventTypeOptions, data.eventType)}
      </Descriptions.Item>
      <Descriptions.Item label="事件来源">
        {data.source}
      </Descriptions.Item>
      <Descriptions.Item label="事件时间">
        {moment(data.eventTime).format('YYYY-MM-DD HH:mm:ss')}
      </Descriptions.Item>
      <Descriptions.Item label="事件内容" span={2}>
        <div style={{ 
          padding: 8, 
          backgroundColor: '#f5f5f5', 
          borderRadius: 4,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}>
          {data.content}
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="处理状态">
        <Tag color={statusOptions.find(opt => opt.itemNo === data.status)?.listClass || 'default'}>
          {getDictText(statusOptions, data.status)}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="处理结果">
        <Tag color={resultOptions.find(opt => opt.itemNo === data.result)?.listClass || 'default'}>
          {getDictText(resultOptions, data.result)}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="拒绝代码">
        {data.rejectCode || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="处理时间">
        {data.processTime || 0} ms
      </Descriptions.Item>
      <Descriptions.Item label="重试次数">
        {data.retryCount || 0}
      </Descriptions.Item>
      <Descriptions.Item label="结果内容" span={2}>
        <div style={{ 
          padding: 8, 
          backgroundColor: '#f5f5f5', 
          borderRadius: 4,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}>
          {data.resultContent || '-'}
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="错误信息" span={2}>
        <div style={{ 
          padding: 8, 
          backgroundColor: '#f5f5f5', 
          borderRadius: 4,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}>
          {data.errorMessage || '-'}
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="创建人">
        {data.createdBy}
      </Descriptions.Item>
      <Descriptions.Item label="创建时间">
        {moment(data.createdDate).format('YYYY-MM-DD HH:mm:ss')}
      </Descriptions.Item>
      <Descriptions.Item label="最后修改人">
        {data.lastModifiedBy || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="最后修改时间">
        {data.lastModifiedDate 
          ? moment(data.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')
          : '-'
        }
      </Descriptions.Item>
    </Descriptions>
  );
};

export default EventDetailList;