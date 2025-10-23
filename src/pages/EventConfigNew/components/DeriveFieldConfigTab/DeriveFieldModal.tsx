/**
 * 衍生字段编辑Modal组件 - 完全按照原页面逻辑实现
 */

import { Button, Form, Input, Modal, Select, Space, Tooltip, message } from 'antd';
import React, { useEffect } from 'react';
import { createDeriveField, updateDeriveField } from '../../services/deriveFieldConfigApi';
import type { DeriveFieldModalProps } from '../../types';

const { TextArea } = Input;

const DeriveFieldModal: React.FC<DeriveFieldModalProps> = ({
  visible,
  editingDeriveField,
  eventNo,
  versionCode,
  fieldTypeOptions,
  deriveFieldProcessTypeOptions,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  // 当编辑字段或强制重置时，更新表单
  useEffect(() => {
    if (visible) {
      if (editingDeriveField) {
        form.setFieldsValue(editingDeriveField);
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingDeriveField, form, forceReset]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 添加eventNo和versionCode参数 - 与原页面一致
      const deriveFieldValues = { ...values, eventNo, versionCode };

      if (editingDeriveField) {
        const response = await updateDeriveField(editingDeriveField.id, deriveFieldValues);
        if (response.code === '0') {
          message.success('更新成功');
          onSubmit(values);
        } else {
          throw new Error(response.message || '更新失败');
        }
      } else {
        const response = await createDeriveField(deriveFieldValues);
        if (response.code === '0') {
          message.success('创建成功');
          onSubmit(values);
        } else {
          throw new Error(response.message || '创建失败');
        }
      }
    } catch (error: any) {
      console.error(error?.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={editingDeriveField ? '编辑衍生字段' : '新增衍生字段'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="fieldName"
          label="字段名称"
          rules={[
            { required: true, message: '请输入字段名称' },
            { max: 128, message: '字段名称不能超过128个字符' },
          ]}
        >
          <Input placeholder="请输入字段名称" maxLength={128} showCount />
        </Form.Item>

        <Form.Item name="fieldType" label="字段类型" rules={[{ required: true }]}>
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
          rules={[{ max: 512, message: '字段描述不能超过512个字符' }]}
        >
          <TextArea placeholder="请输入字段描述" rows={3} maxLength={512} showCount />
        </Form.Item>

        <Form.Item name="processType" label="处理类型" rules={[{ required: true }]}>
          <Select placeholder="请选择处理类型">
            {deriveFieldProcessTypeOptions.map((option: any) => (
              <Select.Option key={option.itemNo} value={option.itemNo}>
                {option.itemDescribe}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="processScript"
          label={
            <span>
              处理脚本
              <Tooltip
                title={
                  <div style={{ maxWidth: '400px' }}>
                    <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#fff' }}>
                      Groovy衍生字段计算模板：
                    </div>
                    <pre
                      style={{
                        background: '#1e1e1e',
                        color: '#d4d4d4',
                        padding: '12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                        border: '1px solid #333',
                        lineHeight: '1.4',
                        cursor: 'pointer',
                        userSelect: 'all',
                      }}
                      onClick={() => {
                        const templateCode = `def calculate(params) {
    // 获取输入数据
    def amount = params.get('amount') ?: 0
    def rate = params.get('rate') ?: 0.1
    def discount = params.get('discount') ?: 0

    // 计算逻辑
    def result = amount * rate
    if (discount > 0) {
        result = result * (1 - discount)
    }

    return result
}`;
                        form.setFieldsValue({ processScript: templateCode });
                      }}
                      title="点击复制模板代码到输入框"
                    >
                      {`def calculate(params) {
    // 获取输入数据
    def amount = params.get('amount') ?: 0
    def rate = params.get('rate') ?: 0.1
    def discount = params.get('discount') ?: 0

    // 计算逻辑
    def result = amount * rate
    if (discount > 0) {
        result = result * (1 - discount)
    }

    return result
}`}
                    </pre>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#e6e6e6' }}>
                      参数说明：
                      <br />
                      • params: 包含所有事件字段
                      <br />
                      {`• 使用 params.get('字段名') 获取字段值`}
                      <br />
                      • 使用 ?: 操作符提供默认值
                      <br />
                      • 返回计算结果
                      <br />
                      <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                        💡 点击上方代码可复制到输入框
                      </span>
                    </div>
                  </div>
                }
                placement="topLeft"
                overlayStyle={{ maxWidth: '500px' }}
              >
                <span style={{ marginLeft: '4px', color: '#1890ff', cursor: 'help' }}>?</span>
              </Tooltip>
            </span>
          }
        >
          <TextArea placeholder="请输入处理脚本" rows={6} showCount />
        </Form.Item>

        <Form.Item
          name="processBean"
          label="处理Bean"
          rules={[{ max: 128, message: '处理Bean不能超过128个字符' }]}
        >
          <Input placeholder="请输入处理Bean类名" maxLength={128} showCount />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingDeriveField ? '更新' : '创建'}
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DeriveFieldModal;
