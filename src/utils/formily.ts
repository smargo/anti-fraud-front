import { ISchema } from '@formily/core';

// 表单验证规则
export const validators = {
  required: (message = '此字段为必填项') => ({
    required: true,
    message,
  }),

  maxLength: (max: number, message?: string) => ({
    maxLength: max,
    message: message || `长度不能超过${max}个字符`,
  }),

  minLength: (min: number, message?: string) => ({
    minLength: min,
    message: message || `长度不能少于${min}个字符`,
  }),

  pattern: (pattern: RegExp, message: string) => ({
    pattern,
    message,
  }),

  email: (message = '请输入有效的邮箱地址') => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message,
  }),

  phone: (message = '请输入有效的手机号码') => ({
    pattern: /^1[3-9]\d{9}$/,
    message,
  }),

  number: (message = '请输入有效数字') => ({
    pattern: /^\d+(\.\d+)?$/,
    message,
  }),

  integer: (message = '请输入整数') => ({
    pattern: /^\d+$/,
    message,
  }),

  url: (message = '请输入有效的URL地址') => ({
    pattern: /^https?:\/\/.+/,
    message,
  }),
};

// 常用表单字段配置
export const fieldConfigs = {
  // 输入框
  input: (title: string, placeholder?: string, required = false) => ({
    type: 'string' as const,
    title,
    required,
    'x-decorator': 'FormItem',
    'x-component': 'Input',
    'x-component-props': {
      placeholder: placeholder || `请输入${title}`,
    },
  }),

  // 数字输入框
  number: (title: string, placeholder?: string, required = false) => ({
    type: 'number' as const,
    title,
    required,
    'x-decorator': 'FormItem',
    'x-component': 'NumberPicker',
    'x-component-props': {
      placeholder: placeholder || `请输入${title}`,
    },
  }),

  // 选择器
  select: (
    title: string,
    options: Array<{ label: string; value: any }>,
    placeholder?: string,
    required = false,
  ) => ({
    type: 'string' as const,
    title,
    required,
    'x-decorator': 'FormItem',
    'x-component': 'Select',
    'x-component-props': {
      placeholder: placeholder || `请选择${title}`,
    },
    enum: options,
  }),

  // 开关
  switch: (title: string, required = false) => ({
    type: 'boolean' as const,
    title,
    required,
    'x-decorator': 'FormItem',
    'x-component': 'Switch',
    'x-component-props': {
      checkedChildren: '启用',
      unCheckedChildren: '禁用',
    },
  }),

  // 日期选择器
  datePicker: (title: string, placeholder?: string, required = false, showTime = false) => ({
    type: 'string' as const,
    title,
    required,
    'x-decorator': 'FormItem',
    'x-component': 'DatePicker',
    'x-component-props': {
      placeholder: placeholder || `请选择${title}`,
      showTime,
      format: showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
    },
  }),

  // 文本域
  textArea: (title: string, placeholder?: string, required = false, rows = 3) => ({
    type: 'string' as const,
    title,
    required,
    'x-decorator': 'FormItem',
    'x-component': 'Input.TextArea',
    'x-component-props': {
      placeholder: placeholder || `请输入${title}`,
      rows,
    },
  }),

  // 密码输入框
  password: (title: string, placeholder?: string, required = false) => ({
    type: 'string' as const,
    title,
    required,
    'x-decorator': 'FormItem',
    'x-component': 'Input.Password',
    'x-component-props': {
      placeholder: placeholder || `请输入${title}`,
    },
  }),

  // 单选框
  radio: (title: string, options: Array<{ label: string; value: any }>, required = false) => ({
    type: 'string' as const,
    title,
    required,
    'x-decorator': 'FormItem',
    'x-component': 'Radio.Group',
    enum: options,
  }),

  // 复选框
  checkbox: (title: string, options: Array<{ label: string; value: any }>, required = false) => ({
    type: 'array' as const,
    title,
    required,
    'x-decorator': 'FormItem',
    'x-component': 'Checkbox.Group',
    enum: options,
  }),
};

// 表单布局配置
export const layoutConfigs = {
  // 单列布局
  singleColumn: (properties: Record<string, any>): ISchema => ({
    type: 'object',
    properties,
  }),

  // 两列布局
  twoColumns: (properties: Record<string, any>): ISchema => ({
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          minColumns: 2,
          maxColumns: 2,
          columnGap: 24,
        },
        properties,
      },
    },
  }),

  // 三列布局
  threeColumns: (properties: Record<string, any>): ISchema => ({
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          minColumns: 3,
          maxColumns: 3,
          columnGap: 16,
        },
        properties,
      },
    },
  }),

  // 四列布局
  fourColumns: (properties: Record<string, any>): ISchema => ({
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          minColumns: 4,
          maxColumns: 4,
          columnGap: 12,
        },
        properties,
      },
    },
  }),
};

// 常用选项数据
export const commonOptions = {
  // 是/否选项
  yesNo: [
    { label: '是', value: true },
    { label: '否', value: false },
  ],

  // 启用/禁用选项
  enabled: [
    { label: '启用', value: true },
    { label: '禁用', value: false },
  ],

  // 状态选项
  status: [
    { label: '正常', value: 1 },
    { label: '禁用', value: 0 },
  ],

  // 优先级选项
  priority: [
    { label: '低', value: 'low' },
    { label: '中', value: 'medium' },
    { label: '高', value: 'high' },
    { label: '紧急', value: 'urgent' },
  ],

  // 风险等级选项
  riskLevel: [
    { label: '低风险', value: 'low' },
    { label: '中风险', value: 'medium' },
    { label: '高风险', value: 'high' },
    { label: '极高风险', value: 'critical' },
  ],
};

// 表单工具函数
export const formUtils = {
  // 创建带验证的字段
  createField: (config: any, validators: any[] = []) => ({
    ...config,
    'x-validator': validators,
  }),

  // 创建只读字段
  createReadonlyField: (config: any) => ({
    ...config,
    'x-component-props': {
      ...config['x-component-props'],
      disabled: true,
    },
  }),

  // 创建隐藏字段
  createHiddenField: (config: any) => ({
    ...config,
    'x-decorator-props': {
      style: { display: 'none' },
    },
  }),

  // 创建跨列字段
  createSpanField: (config: any, span: number) => ({
    ...config,
    'x-decorator-props': {
      gridSpan: span,
    },
  }),

  // 合并字段配置
  mergeFieldConfig: (baseConfig: any, overrideConfig: any) => ({
    ...baseConfig,
    ...overrideConfig,
    'x-component-props': {
      ...baseConfig['x-component-props'],
      ...overrideConfig['x-component-props'],
    },
  }),
};

