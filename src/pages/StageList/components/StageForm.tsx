/**
 * StageForm 组件
 */

import React from 'react';
import { Form, Input, Button, Space, Row, Col, Select } from 'antd';
import type { StageFormProps } from '../types';

const { TextArea } = Input;

const StageForm: React.FC<StageFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  stageBeanOptions,
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
        stageNo: initialValues?.stageNo || '',
        stageName: initialValues?.stageName || '',
        stageBean: initialValues?.stageBean || '',
        stageParam: initialValues?.stageParam || '',
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
            name="stageNo"
            label="阶段编号"
            rules={[{ required: true, message: '请输入阶段编号' }]}
          >
            <Input placeholder="请输入阶段编号" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="stageName"
            label="阶段名称"
            rules={[{ required: true, message: '请输入阶段名称' }]}
          >
            <Input placeholder="请输入阶段名称" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="stageBean"
        label="阶段Bean"
      >
        <Select placeholder="请选择阶段Bean" allowClear>
          {stageBeanOptions.map((option: any) => (
            <Select.Option key={option.itemNo} value={option.itemNo}>
              {option.itemDescribe}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="stageParam"
        label="阶段参数"
      >
        <TextArea placeholder="请输入阶段参数" rows={4} />
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

export default StageForm;

