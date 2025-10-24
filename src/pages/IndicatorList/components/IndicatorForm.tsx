/**
 * IndicatorForm 组件
 */

import { statementApi, StatementDO } from '@/services/antifraud/statement';
import { Button, Form, Input, message, Select, Space } from 'antd';
import React, { useState } from 'react';
import type { IndicatorFormProps } from '../types';

const { TextArea } = Input;

const IndicatorForm: React.FC<IndicatorFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  forceReset,
}) => {
  const [form] = Form.useForm();
  const [statementOptions, setStatementOptions] = useState<StatementDO[]>([]);
  const [statementSearchLoading, setStatementSearchLoading] = useState<boolean>(false);

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form, forceReset]);

  // 语句搜索处理
  const handleStatementSearch = async (value: string) => {
    if (!value) {
      setStatementOptions([]);
      return;
    }

    setStatementSearchLoading(true);
    try {
      const response = await statementApi.statementSearch(value, 1, 20);
      setStatementOptions(response.data || []);
    } catch (error) {
      console.error('搜索语句失败:', error);
      message.error(error?.message || '搜索语句失败');
      setStatementOptions([]);
    } finally {
      setStatementSearchLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="indicatorNo"
        label="指标编号"
        rules={[
          { required: true, message: '请输入指标编号' },
          { max: 128, message: '指标编号不能超过128个字符' },
        ]}
      >
        <Input placeholder="请输入指标编号" disabled={!!initialValues} maxLength={128} showCount />
      </Form.Item>

      <Form.Item
        name="indicatorName"
        label="指标名称"
        rules={[
          { required: true, message: '请输入指标名称' },
          { max: 256, message: '指标名称不能超过256个字符' },
        ]}
      >
        <Input placeholder="请输入指标名称" maxLength={256} showCount />
      </Form.Item>

      <Form.Item
        name="indicatorDesc"
        label="指标描述"
        rules={[{ max: 512, message: '指标描述不能超过512个字符' }]}
      >
        <Input placeholder="请输入指标描述" maxLength={512} showCount />
      </Form.Item>

      <Form.Item
        name="indicatorField"
        label="指标字段"
        rules={[
          { required: true, message: '请输入指标字段' },
          { max: 128, message: '指标字段不能超过128个字符' },
        ]}
      >
        <Input placeholder="请输入指标字段" maxLength={128} showCount />
      </Form.Item>

      <Form.Item
        name="queryField"
        label="查询字段"
        rules={[
          { required: true, message: '请输入查询字段' },
          { max: 128, message: '查询字段不能超过128个字符' },
        ]}
      >
        <Input placeholder="请输入查询字段" maxLength={128} showCount />
      </Form.Item>

      <Form.Item
        name="queryNo"
        label="查询编号"
        rules={[
          { required: true, message: '请选择查询编号' },
          { max: 128, message: '查询编号不能超过128个字符' },
        ]}
      >
        <Select
          showSearch
          placeholder="请搜索并选择查询编号"
          optionFilterProp="children"
          loading={statementSearchLoading}
          onSearch={handleStatementSearch}
          filterOption={false}
          notFoundContent={statementSearchLoading ? '搜索中...' : '请输入关键词搜索语句'}
          style={{ width: '100%' }}
        >
          {statementOptions.map((statement) => (
            <Select.Option key={statement.statementNo} value={statement.statementNo}>
              {statement.statementNo} - {statement.statementDesc || '无描述'}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" onClick={handleSubmit}>
            {initialValues ? '更新' : '创建'}
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default IndicatorForm;
