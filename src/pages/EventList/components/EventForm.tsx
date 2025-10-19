/**
 * EventForm 组件
 */

import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import type { EventFormProps } from '../types';

const EventForm: React.FC<EventFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
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
        eventName: initialValues?.eventName || '',
        eventDesc: initialValues?.eventDesc || '',
      }}
    >
      <Form.Item
        name="eventNo"
        label="事件编号"
        rules={[
          { required: true, message: '请输入事件编号' },
          { max: 50, message: '事件编号不能超过50个字符' },
        ]}
      >
        <Input placeholder="请输入事件编号" disabled={!!initialValues} />
      </Form.Item>

      <Form.Item
        name="eventName"
        label="事件名称"
        rules={[
          { required: true, message: '请输入事件名称' },
          { max: 100, message: '事件名称不能超过100个字符' },
        ]}
      >
        <Input placeholder="请输入事件名称" />
      </Form.Item>

      <Form.Item
        name="eventDesc"
        label="事件描述"
        rules={[{ max: 500, message: '事件描述不能超过500个字符' }]}
      >
        <Input.TextArea
          placeholder="请输入事件描述"
          rows={4}
          showCount
          maxLength={500}
        />
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

export default EventForm;

