/**
 * EventConfig 常量定义
 */

// 字典代码列表
export const DICT_CODE_LIST = [
  'event_field_type_option', 
  'event_derive_field_process_type_option',
  'event_type_option',
  'event_stage_option',
  'stage_bean_option',
  'version_status_option',
  'event_group_option'
];

// Tab配置
export const TAB_CONFIG = {
  basic: { key: 'basic', label: '基础信息' },
  fields: { key: 'fields', label: '字段配置' },
  derive: { key: 'derive', label: '衍生字段' },
  stages: { key: 'stages', label: '阶段配置' },
  indicators: { key: 'indicators', label: '事件指标' },
  dependencies: { key: 'dependencies', label: '语句依赖' }
} as const;

// 版本状态
export const VERSION_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  APPROVED: 'APPROVED',
  ARCHIVED: 'ARCHIVED'
} as const;

// 表单布局
export const FORM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

// 表格配置
export const TABLE_CONFIG = {
  pagination: {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条记录`,
  },
  scroll: { x: 1200 }
};
