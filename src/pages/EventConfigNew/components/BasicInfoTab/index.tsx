/**
 * 基础信息Tab组件
 */

import React from 'react';
import { Form, Input, Select, Button, Row, Col, message } from 'antd';
import { updateEventBasicInfo } from '../../services/eventConfigApi';
import { shouldShowEditInterface } from '../../utils';
import type { BasicInfoTabProps } from '../../types';

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  eventDetail,
  currentVersion,
  isReadOnly,
  configEventLoadProp,
  eventTypeOptions,
  eventGroupOptions,
  onVersionUpdate,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  // 当版本信息更新时，更新表单初始值
  React.useEffect(() => {
    if (eventDetail || currentVersion) {
      form.setFieldsValue({
        eventNo: eventDetail?.eventNo,
        eventName: eventDetail?.eventName,
        ...currentVersion
      });
    }
  }, [eventDetail, currentVersion, form]);

  // 提交基础信息
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const response = await updateEventBasicInfo(eventDetail!.eventNo, values);
      if (response.code === 'SUCCESS') {
        message.success('保存基础信息成功');
        onVersionUpdate?.();
      } else {
        message.error(response.message || '保存基础信息失败');
      }
    } catch (error) {
      message.error('保存基础信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 检查是否应该显示编辑界面
  const showEditInterface = shouldShowEditInterface(configEventLoadProp, isReadOnly);

  // 无版本显示
  const NoVersionDisplay = () => (
    <div style={{ textAlign: 'center', padding: '50px 0' }}>
      <p>请先创建版本或选择版本</p>
    </div>
  );

  // 版本信息显示
  const VersionInfoDisplay = () => (
    <div style={{ marginBottom: 16, padding: '12px 16px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
      <Row gutter={16}>
        <Col span={6}>
          <strong>版本代码：</strong>{currentVersion?.versionCode || '无'}
        </Col>
        <Col span={6}>
          <strong>事件类型：</strong>{currentVersion?.eventType || '无'}
        </Col>
        <Col span={6}>
          <strong>事件分组：</strong>{currentVersion?.eventGroup || '无'}
        </Col>
        <Col span={6}>
          <strong>状态：</strong>{isReadOnly ? '只读' : '可编辑'}
        </Col>
      </Row>
    </div>
  );

  // 无版本选择显示
  const NoVersionSelectedDisplay = () => (
    <div style={{ textAlign: 'center', padding: '50px 0' }}>
      <p>请选择要编辑的版本</p>
    </div>
  );

  return (
    <div>
      {/* 根据状态显示不同的界面 */}
      {!configEventLoadProp || !configEventLoadProp.specifyVersion || !configEventLoadProp.specifyVersion.id || !configEventLoadProp.specifyVersion.versionCode ? (
        <NoVersionDisplay />
      ) : !showEditInterface ? (
        <>
          <VersionInfoDisplay />
          <NoVersionSelectedDisplay />
        </>
      ) : (
        <>
          <VersionInfoDisplay />
          <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={handleSubmit}
            initialValues={{
              eventNo: eventDetail?.eventNo,
              eventName: eventDetail?.eventName,
              ...currentVersion
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
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存基础信息
                </Button>
              </Form.Item>
            )}
          </Form>
        </>
      )}
    </div>
  );
};

export default BasicInfoTab;
