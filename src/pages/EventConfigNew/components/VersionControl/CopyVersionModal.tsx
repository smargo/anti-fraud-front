/**
 * 复制版本弹窗组件
 */

import React from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { copyVersion } from '../../services/eventConfigApi';
import type { CopyVersionModalProps } from '../../types';

const CopyVersionModal: React.FC<CopyVersionModalProps> = ({
  visible,
  eventNo,
  sourceVersion,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (sourceVersion) {
      form.setFieldsValue({
        versionCode: `${sourceVersion.versionCode}_copy`,
        eventType: sourceVersion.eventType,
        eventGroup: sourceVersion.eventGroup,
      });
    }
  }, [sourceVersion, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const response = await copyVersion(eventNo, sourceVersion!.id, values);
      if (response.code === 'SUCCESS') {
        message.success('复制版本成功');
        form.resetFields();
        onSuccess();
        onCancel();
      } else {
        message.error(response.message || '复制版本失败');
      }
    } catch (error) {
      message.error('复制版本失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={`复制版本 - ${sourceVersion?.versionCode}`}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="versionCode"
          label="版本代码"
          rules={[
            { required: true, message: '请输入版本代码' },
            { max: 50, message: '版本代码不能超过50个字符' }
          ]}
        >
          <Input placeholder="请输入版本代码" />
        </Form.Item>

        <Form.Item
          name="eventType"
          label="事件类型"
          rules={[{ required: true, message: '请选择事件类型' }]}
        >
          <Select placeholder="请选择事件类型">
            {/* 这里需要从props传入事件类型选项 */}
          </Select>
        </Form.Item>

        <Form.Item
          name="eventGroup"
          label="事件分组"
          rules={[{ required: true, message: '请选择事件分组' }]}
        >
          <Select placeholder="请选择事件分组">
            {/* 这里需要从props传入事件分组选项 */}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            复制版本
          </Button>
          <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CopyVersionModal;
