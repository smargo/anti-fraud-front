import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Card, Button, Space, Modal, Form, message, Input, Row, Col, Popconfirm, Tooltip, Descriptions, Tag, Select, Divider, Alert } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { statementApi } from '@/services/statement';
import { dataSourceApi, DataSourceDO } from '@/services/datasource';
import { useDictData } from '@/hooks/useDictData';
import { getDictText } from '@/utils/dictUtils';
import moment from 'moment';
import type { ActionType } from '@ant-design/pro-components';

const { TextArea } = Input;

// 定义需要加载的字典代码列表
const DICT_CODE_LIST = [
  'mongo_operate_option'
];

interface StatementItem {
  id: string;
  statementNo: string;
  statementDesc?: string;
  dataSourceNo: string;
  beanId: string;
  statementString: string;
  statementParam: string;
  resultList: string;

  mongoOperationType?: string;
  mongoDatabase?: string;
  mongoCollection?: string;
  
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

const StatementList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStatement, setEditingStatement] = useState<StatementItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingStatement, setViewingStatement] = useState<StatementItem | null>(null);
  const [forceReset, setForceReset] = useState(false);
  
  // 使用字典数据管理Hook
  const { getDictOptions, loading } = useDictData(DICT_CODE_LIST);
  const mongoOperateOptions = getDictOptions('mongo_operate_option');
  
  // 创建actionRef用于控制表格
  const actionRef = useRef<ActionType>();

  const handleAdd = () => {
    setEditingStatement(null);
    setForceReset(prev => !prev); // 切换forceReset状态来触发重置
    setModalVisible(true);
  };

  const handleEdit = (record: StatementItem) => {
    setEditingStatement(record);
    setModalVisible(true);
  };

  const handleView = (record: StatementItem) => {
    setViewingStatement(record);
    setViewModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除这个处理语句吗？`,
      onOk: async () => {
        try {
          const response = await statementApi.delete(Number(id));
          if (response.code === 'SUCCESS') {
            message.success('删除成功');
            // 使用actionRef重新加载表格数据
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
      if (editingStatement) {
        const response = await statementApi.update(Number(editingStatement.id), values);
        if (response.code === 'SUCCESS') {
          message.success('更新成功');
        } else {
          message.error(response.message || '更新失败');
          return;
        }
      } else {
        const response = await statementApi.create(values);
        if (response.code === 'SUCCESS') {
          message.success('创建成功');
        } else {
          message.error(response.message || '创建失败');
          return;
        }
      }
      setModalVisible(false);
      // 使用actionRef重新加载表格数据
      actionRef.current?.reload();
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    }
  };

  const columns = [
    {
      title: '语句编号',
      dataIndex: 'statementNo',
      key: 'statementNo',
      width: 120,
      search: {
        allowClear: true,
        placeholder: '请输入语句编号',
      },
    },
    {
      title: '语句描述',
      dataIndex: 'statementDesc',
      key: 'statementDesc',
      width: 150,
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
              {text || '无'}
            </div>
          </Tooltip>
        );
      },
      search: {
        allowClear: true,
        placeholder: '请输入语句描述',
      },
    },
    {
      title: '数据源编号',
      dataIndex: 'dataSourceNo',
      key: 'dataSourceNo',
      width: 120,
      search: {
        allowClear: true,
        placeholder: '请输入数据源编号',
      },
    },
    {
      title: 'Bean ID',
      dataIndex: 'beanId',
      key: 'beanId',
      width: 120,
      search: false,
    },
    
    {
      title: '参数定义',
      dataIndex: 'statementParam',
      key: 'statementParam',
      width: 150,
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
              {text || '无'}
            </div>
          </Tooltip>
        );
      },
      search: false,
    },
    {
      title: '结果列表',
      dataIndex: 'resultList',
      key: 'resultList',
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
              {text || '无'}
            </div>
          </Tooltip>
        );
      },
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 200,
      render: (_: any, record: StatementItem) => (
        <Space size="middle">
          <a onClick={() => handleView(record)}>
            查看
          </a>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除这个处理语句吗？"
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
              新增处理语句
            </Button>,
          ]}
          request={async (params) => {
            // 格式化搜索参数
            const searchParams = {
              ...params,
            };
            
            const response = await statementApi.list(searchParams);
            // 如果返回的是分页对象，直接返回
            return {
              data: response.records || response.data || [],
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

        <Modal
          title={editingStatement ? '编辑语句' : '新增语句'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          <StatementForm
            initialValues={editingStatement}
            onSubmit={handleFormSubmit}
            onCancel={() => setModalVisible(false)}
            mongoOperateOptions={mongoOperateOptions}
            loading={loading}
            forceReset={forceReset}
          />
        </Modal>

        {/* 查看弹窗 */}
        <Modal
          title="处理语句详情"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={800}
        >
          {viewingStatement && (
            <Descriptions 
              bordered 
              column={2}
              size="middle"
            >
              <Descriptions.Item label="语句ID" span={2}>
                {viewingStatement.id}
              </Descriptions.Item>
              
              <Descriptions.Item label="语句编号">
                <Tag color="green">{viewingStatement.statementNo}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="数据源编号">
                <Tag color="blue">{viewingStatement.dataSourceNo}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="语句描述" span={2}>
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {viewingStatement.statementDesc || '无'}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Bean ID" span={2}>
                <Tag color="orange">{viewingStatement.beanId || '无'}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="参数定义" span={2}>
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#fff7e6', 
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}>
                  {viewingStatement.statementParam || '无'}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="返回值列表" span={2}>
                <Tag color="purple">{viewingStatement.resultList || '无'}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="语句内容" span={2}>
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#f0f0f0', 
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {viewingStatement.statementString || '无'}
                </div>
              </Descriptions.Item>

              {/* MongoDB配置信息 */}
              {viewingStatement.mongoOperationType && (
                <>
                  <Descriptions.Item label="MongoDB操作类型">
                    <Tag color="blue">
                      {getDictText(mongoOperateOptions, viewingStatement.mongoOperationType) || viewingStatement.mongoOperationType}
                    </Tag>
                  </Descriptions.Item>
                  
                  <Descriptions.Item label="MongoDB数据库">
                    <Tag color="green">{viewingStatement.mongoDatabase}</Tag>
                  </Descriptions.Item>
                  
                  <Descriptions.Item label="MongoDB集合">
                    <Tag color="orange">{viewingStatement.mongoCollection}</Tag>
                  </Descriptions.Item>
                </>
              )}
              
              <Descriptions.Item label="创建时间">
                {moment(viewingStatement.createdDate).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              
              <Descriptions.Item label="创建人">
                {viewingStatement.createdBy || '无'}
              </Descriptions.Item>
              
              <Descriptions.Item label="最后修改时间">
                {viewingStatement.lastModifiedDate ? 
                  moment(viewingStatement.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : 
                  '无'
                }
              </Descriptions.Item>
              
              <Descriptions.Item label="最后修改人">
                {viewingStatement.lastModifiedBy || '无'}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Card>
    </PageContainer>
  );
};

interface StatementFormProps {
  initialValues?: StatementItem | null;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  mongoOperateOptions: any[];
  loading: boolean;
  forceReset?: boolean; // 强制重置标志
}

const StatementForm: React.FC<StatementFormProps> = ({ initialValues, onSubmit, onCancel, mongoOperateOptions, loading, forceReset }) => {
  const [form] = Form.useForm();
  const [mongoForm] = Form.useForm(); // MongoDB辅助窗口的独立Form
  const [dataSourceOptions, setDataSourceOptions] = useState<DataSourceDO[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSourceDO | null>(null);
  const [mongoHelperVisible, setMongoHelperVisible] = useState(false);

  // 初始化时加载所有数据源
  React.useEffect(() => {
    loadAllDataSources();
  }, []);

  // 加载所有数据源
  const loadAllDataSources = async () => {
    try {
      const response = await dataSourceApi.list({ current: 1, pageSize: 1000 }); // 假设数据源不会超过1000条
      setDataSourceOptions(response.records || []);
    } catch (error) {
      console.error('加载数据源失败:', error);
      message.error('加载数据源失败');
    }
  };

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      // 如果有数据源编号，从已加载的数据源列表中找到对应的数据源信息
      if (initialValues.dataSourceNo) {
        const dataSource = dataSourceOptions.find(ds => ds.dataSourceNo === initialValues.dataSourceNo);
        setSelectedDataSource(dataSource || null);
      }
    } else {
      form.resetFields();
      setSelectedDataSource(null);
    }
  }, [initialValues, form, dataSourceOptions, forceReset]);


  // 数据源选择变化处理
  const handleDataSourceChange = (value: string) => {
    const dataSource = dataSourceOptions.find(ds => ds.dataSourceNo === value);
    setSelectedDataSource(dataSource || null);
  };

  // 生成MongoDB操作参数数组
  const generateMongoJson = () => {
    const formValues = form.getFieldsValue();
    const mongoValues = mongoForm.getFieldsValue(); // 从MongoDB辅助窗口的Form获取值
    const { 
      mongoOperationType, 
      mongoDatabase, 
      mongoCollection
    } = formValues;
    const { 
      mongoQuery, 
      mongoSort,
      mongoLimit,
      mongoSkip,
      mongoMaxTimeMS,
      mongoProjection,
      mongoPipeline,
      mongoOptions
    } = mongoValues;
    
    if (!mongoOperationType || !mongoDatabase || !mongoCollection) {
      message.warning('请先填写MongoDB操作类型、数据库名和集合名');
      return;
    }

    try {
      const paramsArray: any[] = [];

      // 根据操作类型添加不同的参数
      switch (mongoOperationType) {
        case 'find':
          if (mongoQuery) {
            try {
              paramsArray.push({ query: JSON.parse(mongoQuery) });
            } catch (e) {
              message.error('查询条件JSON格式错误');
              return;
            }
          }
          break;
          
        case 'aggregate':
          if (mongoPipeline) {
            try {
              const pipeline = JSON.parse(mongoPipeline);
              // 对于aggregate操作，直接将管道数组添加到参数数组中
              if (Array.isArray(pipeline)) {
                pipeline.forEach(stage => {
                  paramsArray.push(stage);
                });
              } else {
                message.error('聚合管道必须是数组格式');
                return;
              }
            } catch (e) {
              message.error('聚合管道JSON格式错误');
              return;
            }
          }
          break;
          
        case 'count':
          if (mongoQuery) {
            try {
              paramsArray.push({ filter: JSON.parse(mongoQuery) });
            } catch (e) {
              message.error('过滤条件JSON格式错误');
              return;
            }
          }
          break;
      }

      // 添加通用选项参数
      if (mongoSort) {
        try {
          paramsArray.push({ sort: JSON.parse(mongoSort) });
        } catch (e) {
          message.error('排序条件JSON格式错误');
          return;
        }
      }
      
      if (mongoLimit) {
        paramsArray.push({ limit: parseInt(mongoLimit) });
      }
      
      if (mongoSkip) {
        paramsArray.push({ skip: parseInt(mongoSkip) });
      }
      
      if (mongoMaxTimeMS) {
        paramsArray.push({ maxTimeMS: parseInt(mongoMaxTimeMS) });
      }
      
      if (mongoProjection) {
        try {
          paramsArray.push({ projection: JSON.parse(mongoProjection) });
        } catch (e) {
          message.error('投影字段JSON格式错误');
          return;
        }
      }
      
      if (mongoOptions) {
        try {
          const otherOptions = JSON.parse(mongoOptions);
          // 将其他选项作为单独的键值对添加到数组中
          Object.entries(otherOptions).forEach(([key, value]) => {
            paramsArray.push({ [key]: value });
          });
        } catch (e) {
          message.error('其他选项JSON格式错误');
          return;
        }
      }

      // 将生成的参数数组设置到statementString字段
      form.setFieldsValue({
        statementString: JSON.stringify(paramsArray, null, 2)
      });

      message.success('MongoDB操作参数数组已生成');
      setMongoHelperVisible(false);
    } catch (error) {
      message.error('生成MongoDB操作参数数组失败');
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
      {/* 第一行：语句编号和语句描述 */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="statementNo"
            label="语句编号"
            rules={[{ required: true, message: '请输入编号' }]}
          >
            <Input 
              placeholder="请输入编号" 
              disabled={!!initialValues}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
              name="beanId"
              label="Bean ID"
          >
            <Input placeholder="请输入自定义实现类" />
          </Form.Item>
        </Col>

      </Row>

      {/* 第二行：Bean ID和数据源编号 */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
              name="statementDesc"
              label="语句描述"
          >
            <Input placeholder="请输入语句描述" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="dataSourceNo"
            label="数据源编号"
          >
            <Select
              allowClear
              showSearch
              placeholder="请选择数据源编号"
              onChange={handleDataSourceChange}
              style={{ width: '100%' }}
            >
              {dataSourceOptions.map((dataSource) => (
                <Select.Option key={dataSource.dataSourceNo} value={dataSource.dataSourceNo}>
                  {dataSource.dataSourceNo} - {dataSource.dataSourceName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* MongoDB专用字段 - 当选择MongoDB数据源时显示 */}
      {selectedDataSource?.dataSourceType === 'MongoDB' && (
        <>
          {/* MongoDB操作类型单独一行 */}
          <Form.Item
            name="mongoOperationType"
            label="MongoDB操作类型"
            rules={[{ required: true, message: '请选择MongoDB操作类型' }]}
          >
            <Select
              allowClear
              placeholder="请选择操作类型"
              loading={loading}
              disabled={loading}
            >
              {mongoOperateOptions.map((option: any) => (
                <Select.Option key={option.itemNo} value={option.itemNo}>
                  {option.itemDescribe}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* MongoDB数据库名和集合名一行显示 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="mongoDatabase"
                label="MongoDB数据库名"
                rules={[{ required: true, message: '请输入MongoDB数据库名' }]}
              >
                <Input placeholder="请输入数据库名，如：testdb" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mongoCollection"
                label="MongoDB集合名"
                rules={[{ required: true, message: '请输入MongoDB集合名' }]}
              >
                <Input placeholder="请输入集合名，如：users" />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}

      <Form.Item
        name="statementString"
        label={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>语句内容</span>
            {selectedDataSource?.dataSourceType === 'MongoDB' && (
              <Button
                type="link"
                size="small"
                icon={<SearchOutlined />}
                onClick={() => setMongoHelperVisible(true)}
                style={{ padding: 0, height: 'auto' }}
              >
                MongoDB辅助生成
              </Button>
            )}
          </div>
        }
       
      >
        <TextArea 
          placeholder={selectedDataSource?.dataSourceType === 'MongoDB' 
            ? `MongoDB的find操作参数数组格式示例：
[
  {"query": {"age": {"$gte": 18}}},
  {"sort": {"name": 1, "age": -1}},
  {"limit": 10},
  {"projection": {"name": 1, "age": 1, "_id": 0}}
]

注意：operation、database、collection已在其他字段中配置` 
            : "请输入SQL语句或脚本"
          } 
          rows={8}
          style={{ fontFamily: 'monospace' }}
        />
      </Form.Item>


      <Form.Item
        name="statementParam"
        label={
          <span>
            参数列表
            <Tooltip 
              title="点击查看详细说明"
              placement="topLeft"
            >
              <span 
                style={{ marginLeft: '4px', color: '#1890ff', cursor: 'help' }}
                onClick={() => {
                  Modal.info({
                    title: '参数列表使用说明',
                    width: '50%',
                    content: (
                      <div>
                        <div style={{ marginBottom: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                          <strong>参数列表用于两种场景：</strong>
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                          <h4 style={{ color: '#1890ff', marginBottom: '8px' }}>1. MySQL语句参数替换</h4>
                          <div style={{ marginBottom: '8px' }}>当使用MySQL语句时，使用?占位符，参数列表填入对应的参数名：</div>
                          <pre style={{
                            background: '#f5f5f5',
                            padding: '12px',
                            borderRadius: '6px',
                            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                            fontSize: '12px',
                            lineHeight: '1.5',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            margin: 0,
                            border: '1px solid #d9d9d9'
                          }}>
{`SQL语句示例：
insert into login_record(cust_uid, login_ip, login_date) values(?,?,?)

参数列表填入：
custUid,loginIp,loginDate`}
                          </pre>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <h4 style={{ color: '#1890ff', marginBottom: '8px' }}>2. MongoDB insertOne操作</h4>
                          <div style={{ marginBottom: '8px' }}>当使用MongoDB的insertOne操作时，需要构建document对象：</div>
                          <pre style={{
                            background: '#f5f5f5',
                            padding: '12px',
                            borderRadius: '6px',
                            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                            fontSize: '12px',
                            lineHeight: '1.5',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            margin: 0,
                            border: '1px solid #d9d9d9'
                          }}>
{`参数列表填入：
custUid:custUidKey,custName:custNameKey,custPhone:custPhoneKey

构建的document对象如下：
{
  "custUid": params.get("custUidKey"),
  "custName": params.get("custNameKey"),
  "custPhone": params.get("custPhoneKey")
}`}
                          </pre>
                        </div>

                        <div style={{ 
                          padding: '12px', 
                          backgroundColor: '#fff7e6', 
                          borderRadius: '6px',
                          border: '1px solid #ffd591'
                        }}>
                          <strong>💡 提示：</strong>参数列表中的冒号(:)用于分隔字段名和参数名，逗号(,)用于分隔多个参数。<br/>
                          其他的mongodb操作，如find、aggregate、count等，不需要参数列表。
                        </div>
                      </div>
                    ),
                    okText: '关闭'
                  });
                }}
              >?</span>
            </Tooltip>
          </span>
        }
      >
        <TextArea 
          placeholder='请输入参数列表，只有两类操作需要参数列表：mysql语句或mongodb的insertOne操作。详情可查看上方的问号帮助提示
          '
          rows={3}
          style={{ fontFamily: 'monospace' }}
        />
      </Form.Item>

      <Form.Item
        name="resultList"
        label="返回值列表"
        rules={[{ required: true, message: '请输入返回值列表' }]}
      >
        <Input placeholder="请输入返回值列表字段名" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" onClick={handleSubmit}>
            {initialValues ? '更新' : '创建'}
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </Space>
      </Form.Item>

      {/* MongoDB辅助生成窗口 */}
      <Modal
        title="MongoDB语句辅助生成"
        open={mongoHelperVisible}
        onCancel={() => setMongoHelperVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setMongoHelperVisible(false)}>
            取消
          </Button>,
          <Button key="generate" type="primary" onClick={generateMongoJson}>
            生成并应用
          </Button>
        ]}
      >
        <Alert
          message="提示"
          description="您可以使用下方的辅助配置界面来生成MongoDB操作参数数组，也可以直接在语句内容中手动编写参数数组。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form form={mongoForm} layout="vertical">
          <Form.Item
            name="mongoQuery"
            label="查询条件/过滤条件（find和count操作）"
          >
            <TextArea 
              placeholder="请输入查询条件JSON，如：{'age': {'$gte': 18}}（可选）" 
              rows={3}
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item
            name="mongoSort"
            label="排序条件"
          >
            <TextArea 
              placeholder="请输入排序条件JSON，如：{'name': 1, 'age': -1}（可选）" 
              rows={2}
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="mongoLimit"
                label="限制数量"
              >
                <Input placeholder="如：10（可选）" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="mongoSkip"
                label="跳过数量"
              >
                <Input placeholder="如：0（可选）" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="mongoMaxTimeMS"
                label="最大执行时间(ms)"
              >
                <Input placeholder="如：5000（可选）" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="mongoProjection"
            label="投影字段"
          >
            <TextArea 
              placeholder="请输入投影字段JSON，如：{'name': 1, 'age': 1, '_id': 0}（可选）" 
              rows={2}
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item
            name="mongoPipeline"
            label="聚合管道（仅aggregate操作）"
          >
            <TextArea 
              placeholder="请输入聚合管道JSON数组，如：[{'$match': {'age': {'$gte': 18}}}, {'$group': {'_id': '$department', 'count': {'$sum': 1}}}]（可选）" 
              rows={4}
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item
            name="mongoOptions"
            label="其他选项"
          >
            <TextArea 
              placeholder="请输入其他选项JSON，如：{'maxTimeMS': 5000, 'hint': {'name': 1}}（可选）" 
              rows={3}
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Form>
  );
};

export default StatementList;