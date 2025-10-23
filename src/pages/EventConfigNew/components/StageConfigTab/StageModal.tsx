/**
 * 阶段编辑Modal组件 - 完全按照原页面逻辑实现
 */

import { Button, Form, Input, Modal, Select, Space, message } from 'antd';
import React, { useEffect } from 'react';
import { createStage, updateStage } from '../../services/stageConfigApi';
import type { StageModalProps } from '../../types';

const StageModal: React.FC<StageModalProps> = ({
  visible,
  editingStage,
  eventNo,
  versionCode,
  eventStageOptions,
  stageBeanOptions,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (visible) {
      if (editingStage) {
        form.setFieldsValue(editingStage);
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingStage, form, forceReset]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 添加eventNo和versionCode参数 - 与原页面一致
      const stageValues = { ...values, eventNo, versionCode };

      if (editingStage) {
        const response = await updateStage(editingStage.id, stageValues);
        if (response.code === '0') {
          message.success('更新成功');
          onSubmit(values);
        } else {
          throw new Error(response.message || '更新失败');
        }
      } else {
        const response = await createStage(stageValues);
        if (response.code === '0') {
          message.success('创建成功');
          onSubmit(values);
        } else {
          throw new Error(response.message || '创建失败');
        }
      }
    } catch (error: any) {
      message.error(error?.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={editingStage ? '编辑阶段' : '新增阶段'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          stageNo: 'validate',
        }}
      >
        <Form.Item
          name="stageNo"
          label="阶段编号"
          rules={[{ required: true, message: '请选择阶段编号' }]}
        >
          <Select placeholder="请选择阶段编号">
            {eventStageOptions.map((option: any) => (
              <Select.Option key={option.itemNo} value={option.itemNo}>
                {option.itemDescribe}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="stageName"
          label="阶段名称"
          rules={[
            { required: true, message: '请输入阶段名称' },
            { max: 256, message: '阶段名称不能超过256个字符' },
          ]}
        >
          <Input placeholder="请输入阶段名称" maxLength={256} showCount />
        </Form.Item>

        <Form.Item
          name="stageBean"
          label="阶段组件"
          rules={[{ required: true, message: '请选择阶段组件' }]}
        >
          <Select placeholder="请选择阶段组件" allowClear showSearch optionFilterProp="children">
            {stageBeanOptions.map((option) => (
              <Select.Option key={option.itemNo} value={option.itemNo}>
                {option.itemDescribe}-{option.itemNo}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="stageParam"
          label="阶段参数"
          rules={[{ max: 512, message: '阶段参数不能超过512个字符' }]}
        >
          <Input placeholder="请输入阶段参数（可选）" maxLength={512} showCount />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingStage ? '更新' : '创建'}
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StageModal;
