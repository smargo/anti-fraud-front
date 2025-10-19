# Formily 表单解决方案

本项目已集成 Formily 表单解决方案，提供了强大的表单构建和管理能力。

## 功能特性

- ✅ **Schema 驱动**: 通过 JSON Schema 配置表单，支持动态表单生成
- ✅ **丰富的组件**: 支持输入框、选择器、日期选择器、开关等常用组件
- ✅ **表单验证**: 内置多种验证规则，支持自定义验证
- ✅ **布局系统**: 支持单列、两列、三列、四列等多种布局
- ✅ **响应式**: 支持响应式布局和移动端适配
- ✅ **类型安全**: 完整的 TypeScript 支持

## 核心组件

### 1. FormilyForm 组件

通用的 Formily 表单容器组件：

```tsx
import { FormilyForm } from '../components/Formily/FormilyForm';

<FormilyForm
  form={form}
  schema={schema}
  onSubmit={handleSubmit}
  layout="horizontal"
  labelCol={5}
  wrapperCol={16}
/>;
```

### 2. FormilyDrawerForm 组件

抽屉式表单组件：

```tsx
import { FormilyDrawerForm } from '../components/Formily/FormilyForm';

<FormilyDrawerForm
  open={open}
  title="新增规则"
  schema={schema}
  initialValues={initialValues}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  width={800}
/>;
```

### 3. FormilyModalForm 组件

模态框表单组件：

```tsx
import { FormilyModalForm } from '../components/Formily/FormilyForm';

<FormilyModalForm
  open={open}
  title="编辑规则"
  schema={schema}
  initialValues={initialValues}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>;
```

## 工具函数

### 1. useFormilyForm Hook

表单状态管理 Hook：

```tsx
import { useFormilyForm } from '../hooks/useFormilyForm';

const { form, loading, submit, reset, validate } = useFormilyForm({
  initialValues: { name: '', email: '' },
  onSubmit: async (values) => {
    console.log('提交数据:', values);
  },
});
```

### 2. 表单工具函数

提供了丰富的表单配置工具：

```tsx
import { fieldConfigs, layoutConfigs, validators, formUtils } from '../utils/formily';

// 创建字段配置
const nameField = fieldConfigs.input('姓名', '请输入姓名', true);

// 创建带验证的字段
const emailField = formUtils.createField(fieldConfigs.input('邮箱', '请输入邮箱', true), [
  validators.required(),
  validators.email(),
]);

// 创建布局
const schema = layoutConfigs.twoColumns({
  name: nameField,
  email: emailField,
});
```

## 使用示例

### 基础表单

```tsx
import React from 'react';
import { FormilyDrawerForm } from '../components/Formily/FormilyForm';
import { fieldConfigs, layoutConfigs, validators, formUtils } from '../utils/formily';

const UserForm = ({ open, onSubmit, onCancel }) => {
  const schema = layoutConfigs.twoColumns({
    name: formUtils.createField(fieldConfigs.input('姓名', '请输入姓名', true), [
      validators.required(),
      validators.maxLength(50),
    ]),
    email: formUtils.createField(fieldConfigs.input('邮箱', '请输入邮箱', true), [
      validators.required(),
      validators.email(),
    ]),
    phone: formUtils.createField(fieldConfigs.input('手机号', '请输入手机号', true), [
      validators.required(),
      validators.phone(),
    ]),
    status: fieldConfigs.select(
      '状态',
      [
        { label: '启用', value: true },
        { label: '禁用', value: false },
      ],
      '请选择状态',
      true,
    ),
    description: formUtils.createSpanField(
      fieldConfigs.textArea('描述', '请输入描述', false, 3),
      2,
    ),
  });

  return (
    <FormilyDrawerForm
      open={open}
      title="用户信息"
      schema={schema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      width={800}
    />
  );
};
```

### 复杂表单

```tsx
const ComplexForm = ({ open, onSubmit, onCancel }) => {
  const schema = {
    type: 'object',
    properties: {
      // 基本信息
      basicInfo: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          title: '基本信息',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              minColumns: 2,
              maxColumns: 2,
            },
            properties: {
              name: fieldConfigs.input('姓名', '请输入姓名', true),
              email: fieldConfigs.input('邮箱', '请输入邮箱', true),
            },
          },
        },
      },
      // 高级设置
      advancedSettings: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          title: '高级设置',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              minColumns: 3,
              maxColumns: 3,
            },
            properties: {
              priority: fieldConfigs.select(
                '优先级',
                [
                  { label: '低', value: 'low' },
                  { label: '中', value: 'medium' },
                  { label: '高', value: 'high' },
                ],
                '请选择优先级',
              ),
              enabled: fieldConfigs.switch('是否启用'),
              createDate: fieldConfigs.datePicker('创建日期', '请选择日期'),
            },
          },
        },
      },
    },
  };

  return (
    <FormilyDrawerForm
      open={open}
      title="复杂表单"
      schema={schema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      width={900}
    />
  );
};
```

## 验证规则

内置了多种验证规则：

```tsx
import { validators } from '../utils/formily';

// 必填验证
validators.required('此字段为必填项');

// 长度验证
validators.maxLength(50, '长度不能超过50个字符');
validators.minLength(2, '长度不能少于2个字符');

// 格式验证
validators.email('请输入有效的邮箱地址');
validators.phone('请输入有效的手机号码');
validators.url('请输入有效的URL地址');
validators.number('请输入有效数字');
validators.integer('请输入整数');

// 正则验证
validators.pattern(/^[A-Za-z]+$/, '只能包含字母');
```

## 常用选项

提供了常用的选项数据：

```tsx
import { commonOptions } from '../utils/formily';

// 是/否选项
commonOptions.yesNo;

// 启用/禁用选项
commonOptions.enabled;

// 状态选项
commonOptions.status;

// 优先级选项
commonOptions.priority;

// 风险等级选项
commonOptions.riskLevel;
```

## 样式定制

Formily 组件支持自定义样式：

```less
// 自定义表单样式
.anti-fraud-rule-form {
  .ant-formily-form {
    .ant-form-item {
      margin-bottom: 16px;
    }

    .ant-form-item-label {
      font-weight: 500;
    }
  }
}
```

## 最佳实践

1. **使用工具函数**: 优先使用 `fieldConfigs` 和 `formUtils` 创建字段配置
2. **合理布局**: 根据字段数量选择合适的布局（单列、两列、三列等）
3. **验证规则**: 为重要字段添加适当的验证规则
4. **类型安全**: 使用 TypeScript 确保类型安全
5. **组件复用**: 将常用的表单配置抽象为可复用的组件

## 参考文档

- [Formily 官方文档](https://formilyjs.org/)
- [Formily Antd 组件库](https://formilyjs.org/zh-CN/components/antd)
- [Schema 配置指南](https://formilyjs.org/zh-CN/guide/schema)

