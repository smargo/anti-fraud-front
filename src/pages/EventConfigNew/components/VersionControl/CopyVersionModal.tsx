/**
 * 复制版本弹窗组件
 */

import { Button, Form, Input, message, Modal } from 'antd';
import React from 'react';
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
        versionCode: '',
        versionDesc: `复制自版本${sourceVersion.versionCode}`,
      });
    }
  }, [sourceVersion, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await copyVersion(eventNo, sourceVersion!.id, values);
      if (response.code === '0') {
        message.success('复制版本成功');
        form.resetFields();
        onSuccess();
        onCancel();
      } else {
        throw new Error(response.message || '复制版本失败');
      }
    } catch (error) {
      message.error(error.message || '复制版本失败');
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
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="versionCode"
          label="版本代码"
          rules={[
            { required: true, message: '请输入版本代码' },
            { max: 32, message: '版本代码不能超过32个字符' },
          ]}
        >
          <Input placeholder="请输入版本代码，如：v1.0.0" maxLength={32} showCount />
        </Form.Item>

        <Form.Item
          name="versionDesc"
          label="版本描述"
          rules={[{ max: 512, message: '版本描述不能超过512个字符' }]}
        >
          <Input.TextArea placeholder="请输入版本描述" rows={4} maxLength={512} showCount />
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
