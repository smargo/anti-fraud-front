import React from 'react';
import { Form, Input, Select, Button, Space } from 'antd';

const { TextArea } = Input;

interface EventFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  forceReset?: boolean; // 强制重置标志
}

const EventForm: React.FC<EventFormProps> = ({ initialValues, onSubmit, onCancel, forceReset }) => {
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
    >
      <Form.Item
        name="eventNo"
        label="事件编号"
        rules={[{ required: true, message: '请输入事件编号' }]}
      >
        <Input 
          placeholder="请输入事件编号" 
          disabled={!!initialValues?.id}
        />
      </Form.Item>

      <Form.Item
        name="eventName"
        label="事件名称"
        rules={[{ required: true, message: '请输入事件名称' }]}
      >
        <Input placeholder="请输入事件名称" />
      </Form.Item>

      <Form.Item
        name="eventDesc"
        label="事件描述"
        rules={[{ max: 256, message: '事件描述不能超过256个字符' }]}
      >
        <TextArea 
          placeholder="请输入事件描述" 
          rows={3}
          maxLength={256}
          showCount
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