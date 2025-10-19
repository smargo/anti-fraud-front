import { useMemo, useEffect, useState } from 'react';
import { createForm } from '@formily/core';

export interface UseFormilyFormOptions {
  initialValues?: any;
  validateFirst?: boolean;
  onSubmit?: (values: any) => void;
  onValuesChange?: (values: any) => void;
}

export const useFormilyForm = (options: UseFormilyFormOptions = {}) => {
  const { initialValues = {}, validateFirst = true, onSubmit, onValuesChange } = options;
  const [loading, setLoading] = useState(false);

  const form = useMemo(
    () =>
      createForm({
        validateFirst,
        initialValues,
        effects: (form) => {
          // 监听表单值变化
          if (onValuesChange) {
            form.onValuesChange((values: any) => {
              onValuesChange(values);
            });
          }
        },
      }),
    [validateFirst, initialValues, onValuesChange],
  );

  // 更新表单初始值
  useEffect(() => {
    if (initialValues) {
      form.setValues(initialValues, 'overwrite');
    }
  }, [form, initialValues]);

  // 提交表单
  const submit = async (values?: any) => {
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(values || form.values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const reset = () => {
    form.reset();
  };

  // 验证表单
  const validate = async () => {
    return await form.validate();
  };

  // 设置字段值
  const setFieldValue = (path: string, value: any) => {
    form.setValuesIn(path, value);
  };

  // 获取字段值
  const getFieldValue = (path: string) => {
    return form.getValuesIn(path);
  };

  // 设置字段状态
  const setFieldState = (path: string, state: any) => {
    form.setFieldState(path, state);
  };

  return {
    form,
    loading,
    submit,
    reset,
    validate,
    setFieldValue,
    getFieldValue,
    setFieldState,
    values: form.values,
  };
};
