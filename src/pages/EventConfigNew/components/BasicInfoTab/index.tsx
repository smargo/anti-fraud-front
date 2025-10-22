/**
 * 基础信息Tab组件 - 完全按照原页面逻辑实现
 */

import React from 'react';
import { Form, Input, Select, Button, Row, Col, message } from 'antd';
import { updateEventBasicInfo } from '../../services/eventConfigApi';
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
      if (currentVersion) {
        // 更新版本表中的事件信息
        const { updateVersion } = await import('@/services/antifraud/eventConfigVersion');
        await updateVersion(currentVersion.id, {
          eventType: values.eventType,
          eventGroup: values.eventGroup,
        });
        message.success('基础信息更新成功');
        onVersionUpdate?.();
      } else {
        message.error('当前没有可编辑的版本');
      }
    } catch (error) {
      message.error(error?.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  // 无版本显示
  const NoVersionDisplay = () => (
    <div style={{ 
      marginBottom: 16, 
      padding: 24, 
      background: '#fafafa', 
      borderRadius: 4, 
      textAlign: 'center',
      border: '1px dashed #d9d9d9'
    }}>
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 16, color: '#666' }}>该事件暂无配置版本</span>
      </div>
      <div style={{ color: '#999' }}>
        请先创建版本，然后开始配置事件信息
      </div>
    </div>
  );

  // 版本信息显示 - 原页面返回null，不显示版本信息
  const VersionInfoDisplay = () => null;

  return (
    <div>
      {/* 根据状态显示不同的界面 - 完全按照原页面逻辑 */}
      {!configEventLoadProp || !configEventLoadProp.specifyVersion || !configEventLoadProp.specifyVersion.id || !configEventLoadProp.specifyVersion.versionCode ? (
        <NoVersionDisplay />
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
