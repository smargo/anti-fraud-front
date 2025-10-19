/**
 * BasicInfoTab 组件
 */

import React from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import type { EventDetail, EventConfigVersion } from '../types';

interface BasicInfoTabProps {
  eventDetail: EventDetail | null;
  currentVersion: EventConfigVersion | null;
  eventTypeOptions: any[];
  eventGroupOptions: any[];
  isReadOnly: boolean;
  onSubmit: (values: any) => Promise<void>;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  eventDetail,
  currentVersion,
  eventTypeOptions,
  eventGroupOptions,
  isReadOnly,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    await onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onFinish={handleSubmit}
      initialValues={{
        eventNo: eventDetail?.eventNo,
        eventName: eventDetail?.eventName,
        ...currentVersion,
      }}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name="eventNo"
            label="事件编号"
            rules={[{ required: true }]}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Input placeholder="请输入事件编号" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="eventName"
            label="事件名称"
            rules={[{ required: true }]}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Input placeholder="请输入事件名称" disabled />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name="eventType"
            label="事件类型"
            rules={[{ required: true }]}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Select placeholder="请选择事件类型" disabled={isReadOnly}>
              {eventTypeOptions.map((option: any) => (
                <Select.Option key={option.itemNo} value={option.itemNo}>
                  {option.itemDescribe}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="eventGroup"
            label="事件分组"
            rules={[{ required: true }]}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Select placeholder="请选择事件分组" disabled={isReadOnly}>
              {eventGroupOptions.map((option: any) => (
                <Select.Option key={option.itemNo} value={option.itemNo}>
                  {option.itemDescribe}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {!isReadOnly && (
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存基础信息
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default BasicInfoTab;

