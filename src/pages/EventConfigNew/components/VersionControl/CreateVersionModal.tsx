/**
 * 创建版本弹窗组件
 */

import { Button, Form, Input, message, Modal, Select } from 'antd';
import React from 'react';
import { createVersion } from '../../services/eventConfigApi';
import type { CreateVersionModalProps } from '../../types';

const CreateVersionModal: React.FC<CreateVersionModalProps> = ({
  visible,
  eventNo,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await createVersion(eventNo, values);
      if (response.code === '0') {
        message.success('创建版本成功');
        form.resetFields();
        onSuccess();
        onCancel();
      } else {
        throw new Error(response.message || '创建版本失败');
      }
    } catch (error) {
      message.error(error.message || '创建版本失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal title="创建版本" open={visible} onCancel={handleCancel} footer={null} width={600}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="versionCode"
          label="版本代码"
          rules={[
            { required: true, message: '请输入版本代码' },
            { max: 50, message: '版本代码不能超过50个字符' },
          ]}
        >
          <Input placeholder="请输入版本代码" />
        </Form.Item>

        <Form.Item
          name="eventType"
          label="事件类型"
          rules={[{ required: true, message: '请选择事件类型' }]}
        >
          <Select placeholder="请选择事件类型">{/* 这里需要从props传入事件类型选项 */}</Select>
        </Form.Item>

        <Form.Item
          name="eventGroup"
          label="事件分组"
          rules={[{ required: true, message: '请选择事件分组' }]}
        >
          <Select placeholder="请选择事件分组">{/* 这里需要从props传入事件分组选项 */}</Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            创建版本
          </Button>
          <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateVersionModal;
