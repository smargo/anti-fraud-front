/**
 * DataSourceForm 组件
 */

import React from 'react';
import { Form, Input, Button, Space, Row, Col, Select } from 'antd';
import { useDictData } from '@/hooks/useDictData';
import type { DictItem } from '@/utils/dictUtils';
import type { DataSourceFormProps } from '../types';

const { TextArea } = Input;

// 定义需要加载的字典代码列表
const DICT_CODE_LIST = ['datasource_type_option'];

const DataSourceForm: React.FC<DataSourceFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isEdit = false,
  forceReset,
}) => {
  const [form] = Form.useForm();
  
  // 使用字典数据管理Hook
  const { getDictOptions } = useDictData(DICT_CODE_LIST);
  
  // 获取数据源类型选项
  const dataSourceTypeOptions = getDictOptions('datasource_type_option') as DictItem[];

  // 当 forceReset 变化时重置表单
  React.useEffect(() => {
    if (forceReset) {
      form.resetFields();
    }
  }, [forceReset, form]);

  // 当 initialValues 变化时设置表单值
  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        dataSourceType: 'MYSQL',
      }}
    >
      <Form.Item
        name="dataSourceNo"
        label="数据源编号"
        rules={isEdit ? [] : [{ required: true, message: '请输入数据源编号' }]}
      >
        <Input placeholder="请输入数据源编号" disabled={isEdit} />
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

      <Form.Item name="dataSourceParam" label="数据源参数">
        <TextArea placeholder="请输入数据源参数, key/value形式" rows={4} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" onClick={handleSubmit}>
            {isEdit ? '更新' : '创建'}
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default DataSourceForm;

