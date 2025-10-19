/**
 * SystemDictForm 组件
 */

import React from 'react';
import { Form, Input, Button, Space, Row, Col, Select } from 'antd';
import type { SystemDictFormProps } from '../types';
import type { DictItem } from '@/utils/dictUtils';

const SystemDictForm: React.FC<SystemDictFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  enableOptions,
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
        status: 'Y',
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
          <Form.Item name="otherNo" label="其他映射代码">
            <Input placeholder="请输入其他映射代码" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="listClass" label="展示类别">
            <Input placeholder="请输入展示类别" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="sortNo" label="排序编号">
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

      <Form.Item name="itemDescribe" label="代码描述">
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

export default SystemDictForm;

