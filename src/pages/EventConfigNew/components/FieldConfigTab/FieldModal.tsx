/**
 * 字段配置Modal组件 - 完全按照原页面逻辑实现
 */

import { Button, Form, Input, Modal, Select, Space, Tooltip, message } from 'antd';
import React, { useEffect } from 'react';
import { createEventField, updateEventField } from '../../services/fieldConfigApi';
import type { FieldModalProps } from '../../types';

const { TextArea } = Input;

const FieldModal: React.FC<FieldModalProps> = ({
  visible,
  editingField,
  fieldTypeOptions,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  // 当编辑字段或强制重置时，更新表单
  useEffect(() => {
    if (visible) {
      if (editingField) {
        form.setFieldsValue(editingField);
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingField, form, forceReset]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingField) {
        const response = await updateEventField(editingField.id, values);
        if (response.code === '0') {
          message.success('更新成功');
          onSubmit(values);
        } else {
          throw new Error(response.message || '更新失败');
        }
      } else {
        const response = await createEventField(values);
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
      title={editingField ? '编辑字段' : '新增字段'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
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

        <Form.Item
          name="fieldType"
          label="字段类型"
          rules={[{ required: true, message: '请选择字段类型' }]}
        >
          <Select placeholder="请选择字段类型" loading={loading} disabled={loading}>
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
          rules={[
            { required: true, message: '请输入字段描述' },
            { max: 512, message: '字段描述不能超过512个字符' },
          ]}
        >
          <TextArea placeholder="请输入字段描述" rows={3} maxLength={512} showCount />
        </Form.Item>

        <Form.Item
          name="validateScript"
          label={
            <span>
              校验脚本
              <Tooltip
                title={
                  <div style={{ maxWidth: '400px' }}>
                    <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#fff' }}>
                      Groovy校验脚本模板：
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
                        const templateCode = `def validate(Map<String, Object> params) {
    def u = params.get("userName");
    return u !=null && !u.isEmpty();
}`;
                        form.setFieldsValue({ validateScript: templateCode });
                      }}
                      title="点击复制模板代码到输入框"
                    >
                      {`def validate(Map<String, Object> params) {
    def u = params.get("userName");
    return u !=null && !u.isEmpty();
}`}
                    </pre>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#e6e6e6' }}>
                      参数说明：
                      <br />
                      • params: 当前所有的输入字段
                      <br />
                      • 返回true表示验证通过，false表示验证失败
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
          <TextArea
            placeholder={`请输入groovy校验脚本（可选），样例：
def validate(Map<String, Object> params) {
    def u = params.get("userName");
    return u !=null && !u.isEmpty();
}`}
            rows={4}
            maxLength={1024}
            showCount
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingField ? '更新' : '创建'}
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FieldModal;
