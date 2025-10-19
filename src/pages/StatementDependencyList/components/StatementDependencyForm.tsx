/**
 * StatementDependencyForm 组件
 */

import React from 'react';
import { Form, Input, Button, Space, Row, Col, Select } from 'antd';
import type { StatementDependencyFormProps } from '../types';

const { TextArea } = Input;

const StatementDependencyForm: React.FC<StatementDependencyFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  dependencyTypeOptions,
  isEdit = false,
  forceReset,
}) => {
  const [form] = Form.useForm();

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
        eventNo: initialValues?.eventNo || '',
        versionCode: initialValues?.versionCode || '',
        dependencyNo: initialValues?.dependencyNo || '',
        dependencyName: initialValues?.dependencyName || '',
        dependencyDesc: initialValues?.dependencyDesc || '',
        dependencyType: initialValues?.dependencyType || '',
        dependencyContent: initialValues?.dependencyContent || '',
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="eventNo"
            label="事件编号"
            rules={[{ required: true, message: '请输入事件编号' }]}
          >
            <Input placeholder="请输入事件编号" disabled={isEdit} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="versionCode"
            label="版本编号"
            rules={[{ required: true, message: '请输入版本编号' }]}
          >
            <Input placeholder="请输入版本编号" disabled={isEdit} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="dependencyNo"
            label="依赖编号"
            rules={[{ required: true, message: '请输入依赖编号' }]}
          >
            <Input placeholder="请输入依赖编号" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="dependencyName"
            label="依赖名称"
            rules={[{ required: true, message: '请输入依赖名称' }]}
          >
            <Input placeholder="请输入依赖名称" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="dependencyType"
        label="依赖类型"
        rules={[{ required: true, message: '请选择依赖类型' }]}
      >
        <Select placeholder="请选择依赖类型">
          {dependencyTypeOptions.map((option: any) => (
            <Select.Option key={option.itemNo} value={option.itemNo}>
              {option.itemDescribe}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="dependencyDesc"
        label="依赖描述"
        rules={[{ max: 500, message: '依赖描述不能超过500个字符' }]}
      >
        <TextArea placeholder="请输入依赖描述" rows={3} />
      </Form.Item>

      <Form.Item
        name="dependencyContent"
        label="依赖内容"
      >
        <TextArea placeholder="请输入依赖内容" rows={6} />
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

export default StatementDependencyForm;

