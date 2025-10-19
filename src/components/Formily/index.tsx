import React from 'react';
import { createSchemaField } from '@formily/react';
import {
  FormItem,
  FormGrid,
  FormLayout,
  Input,
  DatePicker,
  Cascader,
  Select,
  ArrayItems,
  Editable,
  Switch,
  NumberPicker,
  Radio,
  Checkbox,
  Upload,
  Transfer,
  TreeSelect,
  TimePicker,
  Space,
} from '@formily/antd-v5';
import { Rate, Slider, Card, Button, Divider } from 'antd';
import { FormProvider } from '@formily/react';
import './index.less';

// 创建 SchemaField 组件
export const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormLayout,
    Input,
    DatePicker,
    Cascader,
    Select,
    ArrayItems,
    Editable,
    Switch,
    NumberPicker,
    Radio,
    Checkbox,
    Upload,
    Transfer,
    TreeSelect,
    TimePicker,
    Rate,
    Slider,
    Card,
    Space,
    Button,
    Divider,
  },
});

// Formily 表单容器组件
export interface FormilyFormProps {
  form: any;
  schema: any;
  onSubmit?: (values: any) => void;
  children?: React.ReactNode;
  className?: string;
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelCol?: number;
  wrapperCol?: number;
}

export const FormilyForm: React.FC<FormilyFormProps> = ({
  form,
  schema,
  onSubmit,
  children,
  className,
  layout = 'horizontal',
  labelCol = 5,
  wrapperCol = 16,
}) => {
  return (
    <FormProvider form={form}>
      <form
        className={className}
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmit) {
            form.submit(onSubmit);
          }
        }}
      >
        <SchemaField schema={schema} />
        {children}
      </form>
    </FormProvider>
  );
};

// 导出常用的 Formily 组件
export {
  FormItem,
  FormGrid,
  FormLayout,
  Input,
  DatePicker,
  Cascader,
  Select,
  ArrayItems,
  Editable,
  Switch,
  NumberPicker,
  Radio,
  Checkbox,
  Upload,
  Transfer,
  TreeSelect,
  TimePicker,
  Rate,
  Slider,
  Card,
  Space,
  Button,
  Divider,
};

// 导出表单组件
export { FormilyDrawerForm, FormilyModalForm } from './FormilyForm';
export type { FormilyDrawerFormProps, FormilyModalFormProps } from './FormilyForm';
