/**
 * 字段编辑弹窗组件
 */

import React from 'react';
import { Modal, Form, Input, Select, Switch, Button, Space } from 'antd';
import type { FieldItem, FieldFormValues, FieldModalProps } from '../../types';

const FieldModal: React.FC<FieldModalProps> = ({
  visible,
  editingField,
  fieldTypeOptions,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  // 当编辑字段或强制重置时，更新表单值
  React.useEffect(() => {
    if (editingField) {
      form.setFieldsValue(editingField);
    } else if (forceReset) {
      form.resetFields();
    }
  }, [editingField, forceReset, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={editingField ? '编辑字段' : '新增字段'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="fieldName"
          label="字段名称"
          rules={[
            { required: true, message: '请输入字段名称' },
            { max: 100, message: '字段名称不能超过100个字符' }
          ]}
        >
          <Input placeholder="请输入字段名称" />
        </Form.Item>

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

        <Form.Item
          name="fieldDesc"
          label="字段描述"
          rules={[{ max: 500, message: '字段描述不能超过500个字符' }]}
        >
          <Input.TextArea placeholder="请输入字段描述" rows={3} />
        </Form.Item>

        <Form.Item
          name="validateRegex"
          label="验证正则"
          rules={[{ max: 200, message: '验证正则不能超过200个字符' }]}
        >
          <Input placeholder="请输入验证正则表达式" />
        </Form.Item>

        <Form.Item
          name="validateScript"
          label="验证脚本"
          rules={[{ max: 1000, message: '验证脚本不能超过1000个字符' }]}
        >
          <Input.TextArea placeholder="请输入验证脚本" rows={4} />
        </Form.Item>

        <Form.Item
          name="required"
          label="是否必填"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {editingField ? '更新' : '创建'}
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FieldModal;
