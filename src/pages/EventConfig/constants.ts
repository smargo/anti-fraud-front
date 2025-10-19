/**
 * EventConfig 页面常量定义
 */

// 需要加载的字典代码列表
export const DICT_CODE_LIST = [
  'event_field_type_option',
  'event_derive_field_process_type_option',
  'event_type_option',
  'event_stage_option',
  'stage_bean_option',
  'version_status_option',
  'event_group_option',
];

// 版本状态选项
export const VERSION_STATUS_OPTIONS = [
  { itemNo: 'DRAFT', itemDescribe: '草稿' },
  { itemNo: 'ACTIVE', itemDescribe: '生效中' },
  { itemNo: 'APPROVED', itemDescribe: '已审批' },
  { itemNo: 'ARCHIVED', itemDescribe: '已归档' },
];

// 表格配置
export const TABLE_CONFIG = {
  pagination: {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条记录`,
  },
  scroll: {
    x: 1200,
  },
};

// 表单配置
export const FORM_CONFIG = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

// 模态框配置
export const MODAL_CONFIG = {
  width: 600,
  footer: null,
};

