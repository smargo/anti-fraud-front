/**
 * EventDetailForm 组件
 */

import React from 'react';
import { Form, Input, Button, Space, Row, Col, Select } from 'antd';
import { convertDictToSelectOptions } from '@/utils/dictUtils';
import type { EventDetailFormProps } from '../types';

const { TextArea } = Input;

const EventDetailForm: React.FC<EventDetailFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  eventTypeOptions,
  statusOptions,
  resultOptions,
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

  const isEdit = !!initialValues;

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues || {
        eventStatus: 'SUCCESS',
        retryCount: 0,
        processTime: 0
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="eventNo"
            label="事件编号"
            rules={isEdit ? [] : [{ required: true, message: '请输入事件编号' }]}
          >
            <Input disabled={isEdit} placeholder={isEdit ? '' : '请输入事件编号'} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="eventTransNo"
            label="交易流水号"
            rules={isEdit ? [] : [{ required: true, message: '请输入交易流水号' }]}
          >
            <Input disabled={isEdit} placeholder={isEdit ? '' : '请输入交易流水号'} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="eventType"
            label="事件类型"
            rules={isEdit ? [] : [{ required: true, message: '请选择事件类型' }]}
          >
            <Select 
              placeholder="请选择事件类型"
              disabled={isEdit}
            >
              {convertDictToSelectOptions(eventTypeOptions).map(option => (
                <Select.Option key={option.key} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="source"
            label="事件来源"
            rules={isEdit ? [] : [{ required: true, message: '请输入事件来源' }]}
          >
            <Input disabled={isEdit} placeholder={isEdit ? '' : '请输入事件来源'} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="content"
        label="事件内容"
        rules={isEdit ? [] : [{ required: true, message: '请输入事件内容' }]}
      >
        <TextArea 
          disabled={isEdit} 
          rows={3} 
          placeholder={isEdit ? '' : '请输入事件内容'}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="eventTime"
            label="事件时间"
            rules={isEdit ? [] : [{ required: true, message: '请输入事件时间' }]}
          >
            <Input disabled={isEdit} placeholder={isEdit ? '' : '请输入事件时间'} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="status"
            label="处理状态"
            rules={[{ required: true, message: '请选择处理状态' }]}
          >
            <Select 
              placeholder="请选择处理状态"
              showSearch
              optionFilterProp="children"
            >
              {convertDictToSelectOptions(statusOptions).map(option => (
                <Select.Option key={option.key} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="result"
            label="处理结果"
            rules={isEdit ? [] : [{ required: true, message: '请选择处理结果' }]}
          >
            <Select 
              placeholder="请选择处理结果"
              disabled={isEdit}
            >
              {convertDictToSelectOptions(resultOptions).map(option => (
                <Select.Option key={option.key} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="rejectCode"
            label="拒绝代码"
          >
            <Input disabled={isEdit} placeholder={isEdit ? '' : '请输入拒绝代码（可选）'} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="resultContent"
        label="结果内容"
      >
        <TextArea 
          disabled={isEdit} 
          rows={3} 
          placeholder={isEdit ? '' : '请输入结果内容（可选）'}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="processTime"
            label="处理时间(ms)"
            rules={isEdit ? [] : [{ required: true, message: '请输入处理时间' }]}
          >
            <Input 
              disabled={isEdit} 
              type="number" 
              placeholder={isEdit ? '' : '请输入处理时间'}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="retryCount"
            label="重试次数"
            rules={isEdit ? [] : [{ required: true, message: '请输入重试次数' }]}
          >
            <Input 
              disabled={isEdit} 
              type="number" 
              placeholder={isEdit ? '' : '请输入重试次数'}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="errorMessage"
        label="错误信息"
      >
        <TextArea 
          disabled={isEdit} 
          rows={2} 
          placeholder={isEdit ? '' : '请输入错误信息（可选）'}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" onClick={handleSubmit}>
            {isEdit ? '更新状态' : '创建'}
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default EventDetailForm;

