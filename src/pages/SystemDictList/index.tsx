import React, { useState, useRef } from 'react';
/** @jsxRuntime automatic */
/** @jsxImportSource react */
import { PageContainer, ProTable, ProColumns, ActionType } from '@ant-design/pro-components';
import { Card, Form, Input, Button, Space, Tag, Popconfirm, Modal, Select, message, Tooltip, Descriptions, Row, Col } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { queryDicts, createDict, updateDict, deleteDict, refreshDicts } from '@/services/dict';
import { useDictData } from '@/hooks/useDictData';
import { convertDictToValueEnum, getDictText, convertDictToSelectOptions } from '@/utils/dictUtils';

const { TextArea } = Input;

// 定义需要加载的字典代码列表
const DICT_CODE_LIST = ['enable_option'];

interface SystemDictItem {
  id?: number;
  codeNo?: string;        // 代码编号
  itemNo?: string;        // 代码项编号
  itemValue?: string;     // 代码项值
  otherNo?: string;       // 其他映射代码
  sortNo?: number;        // 排序编号
  status?: string;        // 是否启用 (Y/N)
  itemDescribe?: string;  // 代码描述
  listClass?: string;     // 展示类别
  createdDate?: string;   // 创建时间
  createdBy?: string;     // 创建人
  lastModifiedDate?: string; // 最后修改时间
  lastModifiedBy?: string;   // 最后修改人
}

const SystemDictList: React.FC = () => {
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [editingDict, setEditingDict] = useState<SystemDictItem | undefined>();
    const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
    const [viewingDict, setViewingDict] = useState<SystemDictItem | undefined>();
    const [forceReset, setForceReset] = useState(false);
    const actionRef = useRef<ActionType>();
    
    // 使用字典数据管理Hook
    const { getDictOptions } = useDictData(DICT_CODE_LIST);
    
    // 获取启用选项
    const enableOptions = getDictOptions('enable_option');

  const handleAdd = () => {
    setEditingDict(undefined);
    setForceReset(prev => !prev); // 切换forceReset状态来触发重置
    setModalVisible(true);
  };

  const handleRefresh = async () => {
    try {
      const response = await refreshDicts();
      if (response?.code === 'SUCCESS') {
        message.success(response?.message || '字典数据刷新成功');
      } else {
        message.error(response?.message || '字典数据刷新失败');
      }
    } catch (error) {
      message.error('字典数据刷新失败');
    }
  };

  const handleEdit = (record: SystemDictItem) => {
    setEditingDict(record);
    setModalVisible(true);
  };

  const handleView = (record: SystemDictItem) => {
    setViewingDict(record);
    setViewModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    if (!id) return;
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个字典项吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteDict({ dictId: id });
          message.success('删除成功');
          actionRef.current?.reload();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleFormSubmit = async (values: SystemDictItem) => {
    try {
      if (editingDict) {
        await updateDict({ ...values, id: editingDict.id });
        message.success('更新成功');
      } else {
        await createDict(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      setEditingDict(undefined);
      actionRef.current?.reload();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns: ProColumns<SystemDictItem>[] = [
    {
      title: '代码编号',
      dataIndex: 'codeNo',
      key: 'codeNo',
      width: 150,
      search: true,
      formItemProps: {
        rules: [{ required: true, message: '请输入代码编号' }],
      },
      valueType: 'text'
    },
    {
      title: '代码项编号',
      dataIndex: 'itemNo',
      key: 'itemNo',
      width: 150,
      search: true,
      formItemProps: {
        rules: [{ required: true, message: '请输入代码项编号' }],
      },
      valueType: 'text'
    },
    {
      title: '代码项值',
      dataIndex: 'itemValue',
      key: 'itemValue',
      width: 200,
      search: false,
      formItemProps: {
        rules: [{ required: true, message: '请输入代码项值' }],
      },
      valueType: 'text'
    },
    {
      title: '代码描述',
      dataIndex: 'itemDescribe',
      key: 'itemDescribe',
      width: 150,
      search: false,
      ellipsis: true,
      render: (text: React.ReactNode) => {
        const content = text || '-';
        return (
          <Tooltip placement="topLeft">
            <div style={{ 
              maxWidth: '180px', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {content}
            </div>
          </Tooltip>
        );
      },
      valueType: 'text'
    },
    {
      title: '排序编号',
      dataIndex: 'sortNo',
      key: 'sortNo',
      width: 100,
      search: false,
      valueType: 'digit'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (e: string) => {
        return getDictText(enableOptions, e);
      },
      search: {
        valueType: 'select',
        valueEnum: convertDictToValueEnum(enableOptions),
        placeholder: '请选择是否启用',
        allowClear: true,
      },
      
    },
    {
      title: '操作',
      key: 'option',
      width: 200,
      valueType: 'option',
      render: (_: any, record: SystemDictItem) => (
        <Space size="middle">
          <a onClick={() => handleView(record)}>查看</a>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除这个字典项吗？"
            onConfirm={() => record.id && handleDelete(record.id)}
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
        <ProTable<SystemDictItem>
          columns={columns}
          request={async (params) => {
            const response = await queryDicts(params);
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
              新增字典项
            </Button>,
            <Button onClick={handleRefresh} icon={<ReloadOutlined />}>
              刷新缓存
            </Button>,
          ]}
        />

        <Modal
          title={editingDict ? '编辑字典项' : '新增字典项'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={600}
        >
          <SystemDictForm
            initialValues={editingDict}
            onSubmit={handleFormSubmit}
            onCancel={() => setModalVisible(false)}
            enableOptions={enableOptions}
            forceReset={forceReset}
          />
        </Modal>

        {/* 查看弹窗 */}
        <Modal
          title="字典项详情"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={800}
        >
          {viewingDict && (
            <Descriptions 
              bordered 
              column={2}
              size="middle"
            >
              <Descriptions.Item label="字典ID" span={2}>
                <Tag color="blue">{viewingDict.id}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="代码编号">
                <Tag color="green">{viewingDict.codeNo}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="代码项编号">
                <Tag color="purple">{viewingDict.itemNo}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="代码项值">
                <Tag color="orange">{viewingDict.itemValue}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="其他映射代码">
                <Tag color="cyan">{viewingDict.otherNo || '无'}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="代码描述" span={2}>
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {viewingDict.itemDescribe || '无'}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="排序编号">
                <Tag color="magenta">{viewingDict.sortNo || '无'}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="展示类别">
                <Tag color="lime">{viewingDict.listClass || '无'}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="状态">
                <Tag color={viewingDict.status === 'Y' ? 'green' : 'red'}>
                  {getDictText(enableOptions || [], viewingDict.status || '')}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="创建时间">
                {viewingDict.createdDate ? 
                  moment(viewingDict.createdDate).format('YYYY-MM-DD HH:mm:ss') : 
                  '无'
                }
              </Descriptions.Item>
              
              <Descriptions.Item label="创建人">
                <Tag color="cyan">{viewingDict.createdBy || '未知'}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="最后修改时间">
                {viewingDict.lastModifiedDate ? 
                  moment(viewingDict.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss') : 
                  '无'
                }
              </Descriptions.Item>
              
              <Descriptions.Item label="最后修改人">
                <Tag color="magenta">{viewingDict.lastModifiedBy || '未知'}</Tag>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Card>
    </PageContainer>
  );
};

interface SystemDictFormProps {
  initialValues?: SystemDictItem | null;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  enableOptions: any[];
  forceReset?: boolean; // 强制重置标志
}

const SystemDictForm: React.FC<SystemDictFormProps> = ({ initialValues, onSubmit, onCancel, enableOptions, forceReset }) => {
  const [form] = Form.useForm();

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
        status: 'Y'
      }}
    >
      <Form.Item
            name="codeNo"
            label="代码编号"
            rules={[{ required: true, message: '请输入代码编号' }]}
          >
            <Input placeholder="请输入代码编号" />
          </Form.Item>
          <Form.Item
            name="itemNo"
            label="代码项编号"
            rules={[{ required: true, message: '请输入代码项编号' }]}
          >
            <Input placeholder="请输入代码项编号" />
          </Form.Item>
          <Form.Item
            name="itemValue"
            label="代码项值"
            rules={[{ required: true, message: '请输入代码项值' }]}
          >
            <Input placeholder="请输入代码项值" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="otherNo"
                label="其他映射代码"
              >
                <Input placeholder="请输入其他映射代码" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="listClass"
                label="展示类别"
              >
                <Input placeholder="请输入展示类别" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sortNo"
                label="排序编号"
              >
                <Input type="number" placeholder="请输入排序编号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="是否启用"
                rules={[{ required: true, message: '请选择是否启用' }]}
              >
                <Select placeholder="请选择是否启用">
                  {enableOptions.map((option) => (
                    <Select.Option key={option.itemNo} value={option.itemNo}>
                      {option.itemDescribe}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="itemDescribe"
            label="代码描述"
          >
            <Input placeholder="请输入代码描述" />
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

export default SystemDictList;