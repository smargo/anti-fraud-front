/**
 * 语句依赖编辑弹窗组件
 */

import { Form, message, Modal, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { statementApi, StatementVO } from '../../services/statementApi';
import type { StatementDependencyModalProps } from '../../types';

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
  const [statementOptions, setStatementOptions] = useState<StatementVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatementNo, setSelectedStatementNo] = useState<string | undefined>(undefined);

  // 加载语句选项 - 完全按照原页面逻辑
  const loadStatementOptions = async () => {
    if (!eventNo || !versionCode) {
      setStatementOptions([]);
      return;
    }

    try {
      setLoading(true);
      const statements = await statementApi.getByEventNoAndVersionCode(eventNo, versionCode);
      setStatementOptions(statements.data || []);
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
      // 设置选中的语句编号状态 - 与原页面一致
      setSelectedStatementNo(editingStatementDependency.statementNo);
    } else if (visible && !editingStatementDependency) {
      form.resetFields();
      // 重置选中的语句编号状态 - 与原页面一致
      setSelectedStatementNo(undefined);
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
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="statementNo"
            label="语句编号"
            rules={[{ required: true, message: '请选择语句编号' }]}
          >
            <Select
              placeholder="请选择语句编号"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                const text = String(option?.children || '');
                return text.toLowerCase().includes(input.toLowerCase());
              }}
              onChange={(value) => {
                // 更新选中的语句编号状态 - 与原页面一致
                setSelectedStatementNo(value);
                // 当第一个下拉框选择改变时，清空第二个下拉框的选择 - 与原页面一致
                const currentDependValue = form.getFieldValue('dependStatementNo');
                if (currentDependValue === value) {
                  form.setFieldValue('dependStatementNo', undefined);
                }
              }}
            >
              {statementOptions.map((statement) => (
                <Select.Option key={statement.statementNo} value={statement.statementNo}>
                  {statement.statementNo}{' '}
                  {statement.statementDesc ? `- ${statement.statementDesc}` : ''}
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
              filterOption={(input, option) => {
                const text = String(option?.children || '');
                return text.toLowerCase().includes(input.toLowerCase());
              }}
            >
              {statementOptions
                .filter((statement) => {
                  // 过滤掉第一个下拉框已选择的语句编号 - 与原页面一致
                  return statement.statementNo !== selectedStatementNo;
                })
                .map((statement) => (
                  <Select.Option key={statement.statementNo} value={statement.statementNo}>
                    {statement.statementNo}{' '}
                    {statement.statementDesc ? `- ${statement.statementDesc}` : ''}
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
