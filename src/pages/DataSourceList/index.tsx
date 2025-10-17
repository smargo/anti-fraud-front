import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, Input, Button, Space, Tag, Popconfirm, Modal, Row, Col, Select, message, Tooltip, Descriptions } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import {ProTable} from '@ant-design/pro-components';
import { ActionType } from '@ant-design/pro-components';
import moment from 'moment';
import { dataSourceApi } from '@/services/datasource';
import { useDictData } from '@/hooks/useDictData';
import { convertDictToValueEnum, getDictText } from '@/utils/dictUtils';

const { TextArea } = Input;

// 定义需要加载的字典代码列表
const DICT_CODE_LIST = ['datasource_type_option'];

interface DataSourceItem {
  id: string;
  dataSourceNo: string;
  dataSourceName: string;
  dataSourceType: string;
  dataSourceConnectString: string;
  dataSourceUserName: string;
  dataSourcePassword: string;
  dataSourceParam: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

const DataSourceList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDataSource, setEditingDataSource] = useState<DataSourceItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingDataSource, setViewingDataSource] = useState<DataSourceItem | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [defaultDatasources, setDefaultDatasources] = useState<string[]>([]);
  const [forceReset, setForceReset] = useState(false);
  const actionRef = useRef<ActionType>();
  
  // 使用字典数据管理Hook
  const { getDictOptions } = useDictData(DICT_CODE_LIST);
  
  // 获取数据源类型选项
  const dataSourceTypeOptions = getDictOptions('datasource_type_option');

  // 加载默认数据源列表
  React.useEffect(() => {
    const loadDefaultDatasources = async () => {
      try {
        const response = await dataSourceApi.getDefaultDatasources();
        setDefaultDatasources(response);
      } catch (error) {
        console.error('加载默认数据源列表失败:', error);
      }
    };
    loadDefaultDatasources();
  }, []);

  // 检查是否为受保护的默认数据源
  const isProtectedDataSource = (dataSourceNo: string) => {
    return defaultDatasources.includes(dataSourceNo);
  };

  const handleAdd = () => {
    setEditingDataSource(null);
    setForceReset(prev => !prev); // 切换forceReset状态来触发重置
    setModalVisible(true);
  };

  const handleEdit = (record: DataSourceItem) => {
    setEditingDataSource(record);
    setModalVisible(true);
  };

  const handleView = (record: DataSourceItem) => {
    setViewingDataSource(record);
    setShowPassword(false); // 重置密码显示状态
    setViewModalVisible(true);
  };

  const handleDelete = (dataSourceNo: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除这个数据源吗？`,
      onOk: async () => {
        try {
          const response = await dataSourceApi.delete(dataSourceNo);
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
      if (editingDataSource) {
        const response = await dataSourceApi.update(editingDataSource.dataSourceNo, { ...values, id: editingDataSource.id });
        if (response.code === 'SUCCESS') {
          message.success('更新成功');
        } else {
          message.error(response.message || '更新失败');
          return;
        }
      } else {
        const response = await dataSourceApi.create(values);
        if (response.code === 'SUCCESS') {
          message.success('创建成功');
        } else {
          message.error(response.message || '创建失败');
          return;
        }
      }
      setModalVisible(false);
      setEditingDataSource(null);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    }
  };

  const columns = [
    {
      title: '数据源编号',
      dataIndex: 'dataSourceNo',
      key: 'dataSourceNo',
      width: 120,
      search: {
        allowClear: true,
        placeholder: '请输入数据源编号'
      }
    },
    {
      title: '数据源名称',
      dataIndex: 'dataSourceName',
      key: 'dataSourceName',
      width: 150,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="topLeft">
            <div style={{ 
              maxWidth: '120px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {text || '-'}
            </div>
          </Tooltip>
        );
      },
      search: {
        allowClear: true,
        placeholder: '请输入数据源名称'
      }
    },
    {
      title: '数据源类型',
      dataIndex: 'dataSourceType',
      key: 'dataSourceType',
      width: 100,
      render: (type: string) => {
        return getDictText(dataSourceTypeOptions || [], type);
      },
      search: {
        valueType: 'select',
        valueEnum: convertDictToValueEnum(dataSourceTypeOptions || []),
        placeholder: '请选择数据源类型',
        allowClear: true,
      },
    },
    {
      title: '连接字符串',
      dataIndex: 'dataSourceConnectString',
      key: 'dataSourceConnectString',
      width: 200,
      ellipsis: true,
      search: false,
      render: (connectString: string) => {
        return (
          <Tooltip placement="topLeft">
            <div style={{ 
              maxWidth: '270px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              {connectString || '-'}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: '用户名',
      dataIndex: 'dataSourceUserName',
      key: 'dataSourceUserName',
      width: 100,
      search: false,
      render: (userName: string) => userName || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 160,
      search: false,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'option',
      width: 200,
      valueType: 'option',
      render: (_: any, record: DataSourceItem) => {
        const isProtected = isProtectedDataSource(record.dataSourceNo);
        return (
          <Space size="middle">
            <a onClick={() => handleView(record)}>查看</a>
            {isProtected ? (
              <Tooltip title="受保护的默认数据源不允许修改">
                <a style={{ color: '#ccc', cursor: 'not-allowed' }}>编辑</a>
              </Tooltip>
            ) : (
              <a onClick={() => handleEdit(record)}>编辑</a>
            )}
            {isProtected ? (
              <Tooltip title="受保护的默认数据源不允许删除">
                <a style={{ color: '#ccc', cursor: 'not-allowed' }}>删除</a>
              </Tooltip>
            ) : (
              <Popconfirm
                title="确定要删除这个数据源吗？"
                onConfirm={() => handleDelete(record.dataSourceNo)}
                okText="确定"
                cancelText="取消"
              >
                <a style={{ color: 'red' }}>删除</a>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <Card>
        <ProTable
          columns={columns}
          request={async (params) => {
            const response = await dataSourceApi.list(params);
            return {
              data: response?.records || [],
              total: response?.total || 0,
              success: response !== null,
            };
          }}
          rowKey="id"
          actionRef={actionRef}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          toolBarRender={() => [
            <Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>
              新增数据源
            </Button>,
          ]}
        />

        <Modal
          title={editingDataSource ? '编辑数据源' : '新增数据源'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          <DataSourceForm
            initialValues={editingDataSource}
            onSubmit={handleFormSubmit}
            onCancel={() => setModalVisible(false)}
            isEdit={!!editingDataSource}
            forceReset={forceReset}
          />
        </Modal>

        {/* 查看弹窗 */}
        <Modal
          title="数据源详情"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={800}
        >
          {viewingDataSource && (
            <Descriptions 
              bordered 
              column={2}
              size="middle"
            >
              <Descriptions.Item label="数据源ID" span={2}>
                {viewingDataSource.id}
              </Descriptions.Item>
              
              <Descriptions.Item label="数据源编号">
                <Tag color="green">{viewingDataSource.dataSourceNo}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="数据源名称">
                <Tag color="purple">{viewingDataSource.dataSourceName}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="数据源类型">
                <Tag color="orange">
                  {getDictText(dataSourceTypeOptions || [], viewingDataSource.dataSourceType)}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="用户名">
                <Tag color="cyan">{viewingDataSource.dataSourceUserName || '无'}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="连接字符串" span={2}>
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}>
                  {viewingDataSource.dataSourceConnectString || '无'}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="密码" span={2}>
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#fff7e6', 
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>
                    {viewingDataSource.dataSourcePassword ? 
                      (showPassword ? viewingDataSource.dataSourcePassword : '••••••••') : 
                      '无'
                    }
                  </span>
                  {viewingDataSource.dataSourcePassword && (
                    <Button
                      type="text"
                      size="small"
                      icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ 
                        padding: '0 4px',
                        height: '20px',
                        minWidth: '20px'
                      }}
                    />
                  )}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="数据源参数" span={2}>
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#f0f0f0', 
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}>
                  {viewingDataSource.dataSourceParam || '无'}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="创建时间">
                {moment(viewingDataSource.createdDate).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              
              <Descriptions.Item label="最后修改时间">
                {viewingDataSource.lastModifiedDate ? 
                  moment(viewingDataSource.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : 
                  '无'
                }
              </Descriptions.Item>
              
              <Descriptions.Item label="创建人">
                {viewingDataSource.createdBy || '无'}
              </Descriptions.Item>
              
              <Descriptions.Item label="最后修改人">
                {viewingDataSource.lastModifiedBy || '无'}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Card>
    </PageContainer>
  );
};

interface DataSourceFormProps {
  initialValues?: DataSourceItem | null;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isEdit?: boolean;
  forceReset?: boolean; // 强制重置标志
}

const DataSourceForm: React.FC<DataSourceFormProps> = ({ initialValues, onSubmit, onCancel, isEdit = false, forceReset }) => {
  const [form] = Form.useForm();
  
  // 使用字典数据管理Hook
  const { getDictOptions } = useDictData(DICT_CODE_LIST);
  
  // 获取数据源类型选项
  const dataSourceTypeOptions = getDictOptions('datasource_type_option');

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form, forceReset]);

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
      initialValues={{
        dataSourceType: 'MYSQL'
      }}
    >
      <Form.Item
        name="dataSourceNo"
        label="数据源编号"
        rules={isEdit ? [] : [{ required: true, message: '请输入数据源编号' }]}
      >
        <Input 
          placeholder="请输入数据源编号" 
          disabled={isEdit}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="dataSourceName"
            label="数据源名称"
            rules={[{ required: true, message: '请输入数据源名称' }]}
          >
            <Input placeholder="请输入数据源名称" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="dataSourceType"
            label="数据源类型"
            rules={[{ required: true, message: '请选择数据源类型' }]}
          >
            <Select placeholder="请选择数据源类型">
              {(dataSourceTypeOptions || []).map(option => (
                <Select.Option key={option.itemNo} value={option.itemNo}>
                  {option.itemDescribe}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="dataSourceConnectString"
        label="连接字符串"
        rules={[{ required: true, message: '请输入连接字符串' }]}
      >
        <TextArea placeholder="请输入连接字符串" rows={3} />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="dataSourceUserName"
            label="用户名"
          >
            <Input placeholder="请输入用户名（可选）" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="dataSourcePassword"
            label="密码"
          >
            <Input.Password placeholder="请输入密码（可选）" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="dataSourceParam"
        label="数据源参数"
      >
        <TextArea placeholder="请输入数据源参数, key/value形式" rows={4} />
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

export default DataSourceList;