/**
 * 事件指标编辑Modal组件 - 完全按照原页面逻辑实现
 */

import { IndicatorItem } from '@/pages/IndicatorList/types';
import { Button, Form, Input, message, Modal, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { createEventIndicator, updateEventIndicator } from '../../services/eventIndicatorConfigApi';
import { indicatorApi } from '../../services/indicatorApi';
import type { EventIndicatorModalProps } from '../../types';

const EventIndicatorModal: React.FC<EventIndicatorModalProps> = ({
  visible,
  editingEventIndicator,
  eventNo,
  versionCode,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [indicatorOptions, setIndicatorOptions] = useState<IndicatorItem[]>([]);
  const [indicatorSearchLoading, setIndicatorSearchLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // 指标搜索处理
  const handleIndicatorSearch = async (value: string) => {
    if (!value) {
      setIndicatorOptions([]);
      return;
    }

    setIndicatorSearchLoading(true);
    try {
      const response = await indicatorApi.searchIndicator(value, 1, 20);
      setIndicatorOptions(response.data || []);
    } catch (error: any) {
      console.error('搜索指标失败:', error);
      message.error(error?.message || '搜索指标失败');
      setIndicatorOptions([]);
    } finally {
      setIndicatorSearchLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      if (editingEventIndicator) {
        form.setFieldsValue(editingEventIndicator);
      } else {
        form.resetFields();
        // 设置默认的事件编号
        form.setFieldsValue({ eventNo: eventNo });
      }
      setIndicatorOptions([]); // 清空指标选项
    }
  }, [visible, editingEventIndicator, form, forceReset]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 添加versionCode参数 - 与原页面一致
      const eventIndicatorValues = { ...values, eventNo, versionCode };

      if (editingEventIndicator) {
        const response = await updateEventIndicator(editingEventIndicator.id, eventIndicatorValues);
        if (response.code === '0') {
          message.success('更新成功');
          onSubmit(values);
        } else {
          throw new Error(response.message || '更新失败');
        }
      } else {
        const response = await createEventIndicator(eventIndicatorValues);
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
      title={editingEventIndicator ? '编辑事件指标' : '新增事件指标'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="eventNo" label="事件编号" rules={[{ required: true }]}>
          <Input placeholder="请输入事件编号" disabled={true} />
        </Form.Item>

        <Form.Item name="indicatorNo" label="指标编号" rules={[{ required: true }]}>
          <Select
            showSearch
            placeholder="请搜索并选择指标编号"
            optionFilterProp="children"
            loading={indicatorSearchLoading}
            onSearch={handleIndicatorSearch}
            filterOption={false}
            notFoundContent={indicatorSearchLoading ? '搜索中...' : '请输入关键词搜索指标'}
            style={{ width: '100%' }}
          >
            {indicatorOptions.map((indicator) => (
              <Select.Option key={indicator.indicatorNo} value={indicator.indicatorNo}>
                {indicator.indicatorNo} - {indicator.indicatorName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingEventIndicator ? '更新' : '创建'}
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EventIndicatorModal;
