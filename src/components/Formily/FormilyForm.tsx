import React, { useEffect } from 'react';
import { Drawer, Spin, Button, Modal } from 'antd';
import { FormilyForm, SchemaField } from './index';
import { useFormilyForm } from '../../hooks/useFormilyForm';

export interface FormilyDrawerFormProps {
  open: boolean;
  title: string;
  schema: any;
  initialValues?: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  loading?: boolean;
  width?: number;
  className?: string;
  destroyOnClose?: boolean;
  submitText?: string;
  cancelText?: string;
}

export const FormilyDrawerForm: React.FC<FormilyDrawerFormProps> = ({
  open,
  title,
  schema,
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  width = 700,
  className,
  destroyOnClose = true,
  submitText = '确定',
  cancelText = '取消',
}) => {
  const { form, submit, reset } = useFormilyForm({
    initialValues,
    onSubmit,
  });

  // 当弹窗打开时重置表单
  useEffect(() => {
    if (open) {
      form.setValues(initialValues, 'overwrite');
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    await submit();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Drawer
      title={title}
      open={open}
      onClose={handleCancel}
      width={width}
      className={className}
      destroyOnClose={destroyOnClose}
      extra={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={handleCancel}>{cancelText}</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {submitText}
          </Button>
        </div>
      }
    >
      <Spin spinning={loading}>
        <FormilyForm form={form} schema={schema} />
      </Spin>
    </Drawer>
  );
};

export interface FormilyModalFormProps {
  open: boolean;
  title: string;
  schema: any;
  initialValues?: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  loading?: boolean;
  width?: number;
  className?: string;
  destroyOnClose?: boolean;
  submitText?: string;
  cancelText?: string;
}

export const FormilyModalForm: React.FC<FormilyModalFormProps> = ({
  open,
  title,
  schema,
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  width = 700,
  className,
  destroyOnClose = true,
  submitText = '确定',
  cancelText = '取消',
}) => {
  const { form, submit, reset } = useFormilyForm({
    initialValues,
    onSubmit,
  });

  // 当弹窗打开时重置表单
  useEffect(() => {
    if (open) {
      form.setValues(initialValues, 'overwrite');
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    await submit();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleCancel}
      width={width}
      className={className}
      destroyOnClose={destroyOnClose}
      footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button onClick={handleCancel}>{cancelText}</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {submitText}
          </Button>
        </div>
      }
    >
      <Spin spinning={loading}>
        <FormilyForm form={form} schema={schema} />
      </Spin>
    </Modal>
  );
};
