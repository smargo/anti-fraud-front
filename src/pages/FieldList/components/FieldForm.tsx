/**
 * FieldForm 组件
 */

import React from 'react';
import { Form, Input, Button, Space, Row, Col, Select } from 'antd';
import type { FieldFormProps } from '../types';

const { TextArea } = Input;

const FieldForm: React.FC<FieldFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  fieldTypeOptions,
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
        fieldName: initialValues?.fieldName || '',
        fieldType: initialValues?.fieldType || '',
        fieldDesc: initialValues?.fieldDesc || '',
        validateScript: initialValues?.validateScript || '',
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
            name="fieldName"
            label="字段名称"
            rules={[{ required: true, message: '请输入字段名称' }]}
          >
            <Input placeholder="请输入字段名称" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="fieldType"
            label="字段类型"
            rules={[{ required: true, message: '请选择字段类型' }]}
          >
            <Select placeholder="请选择字段类型">
              {fieldTypeOptions.map((option: any) => (
                <Select.Option key={option.itemNo} value={option.itemNo}>
                  {option.itemDescribe}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="fieldDesc"
        label="字段描述"
        rules={[{ max: 500, message: '字段描述不能超过500个字符' }]}
      >
        <TextArea placeholder="请输入字段描述" rows={3} />
      </Form.Item>

      <Form.Item
        name="validateScript"
        label="验证脚本"
      >
        <TextArea placeholder="请输入验证脚本" rows={4} />
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

export default FieldForm;

