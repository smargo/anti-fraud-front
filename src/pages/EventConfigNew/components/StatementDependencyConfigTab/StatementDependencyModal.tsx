/**
 * 语句依赖编辑弹窗组件
 */

import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, message, Spin } from 'antd';
import { statementApi, StatementDO } from '../../services/statementApi';
import type { StatementDependencyItem, StatementDependencyFormValues, StatementDependencyModalProps } from '../../types';

const StatementDependencyModal: React.FC<StatementDependencyModalProps> = ({
  visible,
  editingStatementDependency,
  eventNo,
  versionCode,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [statementOptions, setStatementOptions] = useState<StatementDO[]>([]);
  const [loading, setLoading] = useState(false);

  // 加载语句选项 - 完全按照原页面逻辑
  const loadStatementOptions = async () => {
    if (!eventNo || !versionCode) {
      setStatementOptions([]);
      return;
    }
    
    try {
      setLoading(true);
      const statements = await statementApi.getByEventNoAndVersionCode(eventNo, versionCode);
      setStatementOptions(statements || []);
    } catch (error) {
      console.error('获取语句选项失败:', error);
      message.error('获取语句选项失败');
      setStatementOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // 表单重置
  useEffect(() => {
    if (forceReset) {
      form.resetFields();
    }
  }, [forceReset, form]);

  // 编辑时填充表单
  useEffect(() => {
    if (visible && editingStatementDependency) {
      form.setFieldsValue({
        statementNo: editingStatementDependency.statementNo,
        dependStatementNo: editingStatementDependency.dependStatementNo,
      });
    } else if (visible && !editingStatementDependency) {
      form.resetFields();
    }
  }, [visible, editingStatementDependency, form]);

  // 弹窗显示时加载语句选项
  useEffect(() => {
    if (visible) {
      loadStatementOptions();
    }
  }, [visible]);

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      message.error('表单验证失败');
    }
  };

  return (
    <Modal
      title={editingStatementDependency ? '编辑语句依赖' : '新增语句依赖'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={600}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          preserve={false}
        >
          <Form.Item
            name="statementNo"
            label="语句编号"
            rules={[{ required: true, message: '请选择语句编号' }]}
          >
            <Select 
              placeholder="请选择语句编号" 
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {statementOptions.map((option: any) => (
                <Select.Option key={option.statementNo} value={option.statementNo}>
                  {option.statementDesc || option.statementNo} ({option.statementNo})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dependStatementNo"
            label="依赖语句编号"
            rules={[{ required: true, message: '请选择依赖语句编号' }]}
          >
            <Select 
              placeholder="请选择依赖语句编号" 
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {statementOptions.map((option: any) => (
                <Select.Option key={option.statementNo} value={option.statementNo}>
                  {option.statementDesc || option.statementNo} ({option.statementNo})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default StatementDependencyModal;
