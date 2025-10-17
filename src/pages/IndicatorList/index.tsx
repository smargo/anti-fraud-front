import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Card, Button, Space, Modal, Form, message, Input, Row, Col, Popconfirm, Tooltip, Descriptions, Tag, Select } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { indicatorApi } from '@/services/indicator';
import { statementApi, StatementDO } from '@/services/statement';
import moment from 'moment';
import { ActionType } from '@ant-design/pro-components';

const { TextArea } = Input;

interface IndicatorItem {
  id: string;
  indicatorNo: string;
  indicatorName: string;
  indicatorDesc: string;
  indicatorField: string;
  queryField: string;
  queryNo: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

const IndicatorList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<IndicatorItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingIndicator, setViewingIndicator] = useState<IndicatorItem | null>(null);
  const [forceReset, setForceReset] = useState(false);
  
  // 创建actionRef用于控制表格
  const actionRef = useRef<ActionType>();

  const handleAdd = () => {
    setEditingIndicator(null);
    setForceReset(prev => !prev); // 切换forceReset状态来触发重置
    setModalVisible(true);
  };

  const handleEdit = (record: IndicatorItem) => {
    setEditingIndicator(record);
    setModalVisible(true);
  };

  const handleView = (record: IndicatorItem) => {
    setViewingIndicator(record);
    setViewModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除这个指标吗？`,
      onOk: async () => {
        try {
          const response = await indicatorApi.delete(Number(id));
          if (response.code === 'SUCCESS') {
            message.success('删除成功');
            actionRef.current?.reload();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error: any) {
          message.error(error?.message || '删除失败');
        }
      },
    });
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (editingIndicator) {
        const response = await indicatorApi.update(Number(editingIndicator.id), values);
        if (response.code === 'SUCCESS') {
          message.success('更新成功');
        } else {
          message.error(response.message || '更新失败');
          return;
        }
      } else {
        const response = await indicatorApi.create(values);
        if (response.code === 'SUCCESS') {
          message.success('创建成功');
        } else {
          message.error(response.message || '创建失败');
          return;
        }
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '指标编号',
      dataIndex: 'indicatorNo',
      key: 'indicatorNo',
      width: 180,
      search: {
        allowClear: true,
        placeholder: '请输入指标编号',
      },
    },
    {
      title: '指标名称',
      dataIndex: 'indicatorName',
      key: 'indicatorName',
      width: 200,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="topLeft">
            <div style={{ 
              maxWidth: '180px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {text}
            </div>
          </Tooltip>
        );
      },
      search: {
        allowClear: true,
        placeholder: '请输入指标名称',
      },
    },
    {
      title: '指标描述',
      dataIndex: 'indicatorDesc',
      key: 'indicatorDesc',
      width: 150,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="topLeft">
            <div style={{ 
              maxWidth: '140px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {text || '无'}
            </div>
          </Tooltip>
        );
      },
      search: false,
    },
    {
      title: '指标字段',
      dataIndex: 'indicatorField',
      key: 'indicatorField',
      width: 120,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="topLeft">
            <div style={{ 
              maxWidth: '100px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {text}
            </div>
          </Tooltip>
        );
      },
      search: false,
    },
    {
      title: '查询字段',
      dataIndex: 'queryField',
      key: 'queryField',
      width: 120,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="topLeft">
            <div style={{ 
              maxWidth: '100px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {text}
            </div>
          </Tooltip>
        );
      },
      search: false,
    },
    {
      title: '查询编号',
      dataIndex: 'queryNo',
      key: 'queryNo',
      width: 120,
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 200,
      render: (_: any, record: IndicatorItem) => (
        <Space size="middle">
          <a onClick={() => handleView(record)}>
            查看
          </a>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除这个指标吗？"
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
        <ProTable
          cardBordered
          actionRef={actionRef}
          toolBarRender={() => [
            <Button
              key="add"
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增指标
            </Button>,
          ]}
          request={async (params) => {
            // 格式化搜索参数
            const searchParams = {
              ...params,
            };
            
            const response = await indicatorApi.list(searchParams);

            // 如果返回的是分页对象，直接返回
            return {
              data: response.records || [],
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
        />

        {/* 新增/编辑弹窗 */}
        <Modal
          title={editingIndicator ? '编辑指标' : '新增指标'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          <IndicatorForm
            initialValues={editingIndicator}
            onSubmit={handleFormSubmit}
            onCancel={() => setModalVisible(false)}
            forceReset={forceReset}
          />
        </Modal>

        {/* 查看弹窗 */}
        <Modal
          title="指标详情"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={800}
        >
          {viewingIndicator && (
            <Descriptions 
              bordered 
              column={2}
              size="middle"
            >
              <Descriptions.Item label="指标ID" span={2}>
                {viewingIndicator.id}
              </Descriptions.Item>
              
              <Descriptions.Item label="指标编号">
                <Tag color="green">{viewingIndicator.indicatorNo}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="指标名称">
                <Tag color="purple">{viewingIndicator.indicatorName}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="指标描述" span={2}>
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {viewingIndicator.indicatorDesc || '无'}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="指标字段" span={2}>
                <Tag color="orange">{viewingIndicator.indicatorField}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="查询字段" span={2}>
                <Tag color="cyan">{viewingIndicator.queryField}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="查询编号" span={2}>
                <Tag color="blue">{viewingIndicator.queryNo}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="创建时间">
                {moment(viewingIndicator.createdDate).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              
              <Descriptions.Item label="创建人">
                {viewingIndicator.createdBy || '无'}
              </Descriptions.Item>
              
              <Descriptions.Item label="最后修改时间">
                {viewingIndicator.lastModifiedDate ? 
                  moment(viewingIndicator.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : 
                  '无'
                }
              </Descriptions.Item>
              
              <Descriptions.Item label="最后修改人">
                {viewingIndicator.lastModifiedBy || '无'}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Card>
    </PageContainer>
  );
};

// 指标表单组件
interface IndicatorFormProps {
  initialValues?: IndicatorItem | null;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  forceReset?: boolean; // 强制重置标志
}

const IndicatorForm: React.FC<IndicatorFormProps> = ({ initialValues, onSubmit, onCancel, forceReset }) => {
  const [form] = Form.useForm();
  const [statementOptions, setStatementOptions] = useState<StatementDO[]>([]);
  const [statementSearchLoading, setStatementSearchLoading] = useState<boolean>(false);

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form, forceReset]);

  // 语句搜索处理
  const handleStatementSearch = async (value: string) => {
    if (!value) {
      setStatementOptions([]);
      return;
    }
    
    setStatementSearchLoading(true);
    try {
      const response = await statementApi.search(value, 1, 20);
      setStatementOptions(response.records || []);
    } catch (error) {
      console.error('搜索语句失败:', error);
      message.error(error?.message || '搜索语句失败');
      setStatementOptions([]);
    } finally {
      setStatementSearchLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
    >
      <Form.Item
        name="indicatorNo"
        label="指标编号"
        rules={[{ required: true, message: '请输入指标编号' }]}
      >
        <Input 
          placeholder="请输入指标编号" 
          disabled={!!initialValues}
        />
      </Form.Item>

      <Form.Item
        name="indicatorName"
        label="指标名称"
        rules={[{ required: true, message: '请输入指标名称' }]}
      >
        <Input placeholder="请输入指标名称" />
      </Form.Item>

      <Form.Item
        name="indicatorDesc"
        label="指标描述"
      >
        <Input placeholder="请输入指标描述" />
      </Form.Item>

      <Form.Item
        name="indicatorField"
        label="指标字段"
        rules={[{ required: true, message: '请输入指标字段' }]}
      >
        <Input placeholder="请输入指标字段" />
      </Form.Item>

      <Form.Item
        name="queryField"
        label="查询字段"
        rules={[{ required: true, message: '请输入查询字段' }]}
      >
        <Input placeholder="请输入查询字段" />
      </Form.Item>

      <Form.Item
        name="queryNo"
        label="查询编号"
        rules={[{ required: true, message: '请选择查询编号' }]}
      >
        <Select
          showSearch
          placeholder="请搜索并选择查询编号"
          optionFilterProp="children"
          loading={statementSearchLoading}
          onSearch={handleStatementSearch}
          filterOption={false}
          notFoundContent={statementSearchLoading ? '搜索中...' : '请输入关键词搜索语句'}
          style={{ width: '100%' }}
        >
          {statementOptions.map((statement) => (
            <Select.Option key={statement.statementNo} value={statement.statementNo}>
              {statement.statementNo} - {statement.statementDesc || '无描述'}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" onClick={handleSubmit}>
            {initialValues ? '更新' : '创建'}
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default IndicatorList;