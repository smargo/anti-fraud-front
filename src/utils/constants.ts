/**
 * 常量定义
 * 统一维护项目中的各种常量
 */

// 统一维护 SessionStorage 的 key
export enum SessionStorageKeys {
  当前任务 = 'MY_WORK_ID',
  当前用户 = 'MY_WORK_UID',
  任务列表 = 'MY_WORK_LIST',
  用户信息 = 'USER_INFO',
  权限信息 = 'PERMISSIONS',
  主题设置 = 'THEME_SETTINGS',
}

// 统一维护 LocalStorage 的 key
export enum LocalStorageKeys {
  用户令牌 = 'Phoenix:token',
  用户偏好 = 'USER_PREFERENCES',
  语言设置 = 'LANGUAGE_SETTINGS',
  布局设置 = 'LAYOUT_SETTINGS',
}

// 列表分页配置
export const PAGINATION = {
  pageSizeOptions: [10, 20, 30, 50, 100],
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) =>
    `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
};

// 有无
export const HAS_OR_NOT = {
  true: '有',
  false: '无',
};

// 是否-YN
export const IS_OR_NOT_YN = {
  Y: '是',
  N: '否',
};

// 是否-10
export const IS_OR_NOT_NBR = {
  1: '是',
  0: '否',
};

// 处理下拉框中选项顺序问题
export const IS_OR_NOT_NBR_OPTIONS = [
  {
    value: 1,
    label: '是',
  },
  {
    value: 0,
    label: '否',
  },
];

// 是否-true false
export const IS_OR_NOT = {
  true: '是',
  false: '否',
};

export const IS_OR_NOT_WITH_STATUS = {
  true: {
    text: '是',
    status: 'Success',
  },
  false: {
    text: '否',
    status: 'Error',
  },
};

// 对象类型选项
export const OBJECT_TYPE_OPTIONS = [
  { value: 'APPLY', label: '申请类型' },
  { value: 'FLOW', label: '流程类型' },
  { value: 'TASK', label: '任务类型' },
  { value: 'STEP', label: '步骤类型' },
];

// 交易类型选项
export const TRANS_TYPE_OPTIONS = [
  { value: 'PRE', label: '预审' },
  { value: 'CRA', label: '授信' },
  { value: 'USE', label: '用信' },
  { value: 'TEL', label: '电核' },
  { value: 'REN', label: '续签' },
  { value: 'CHC', label: '调额' },
];

// 审批结果
export const APPROVE_RESULT_OPTIONS = [
  { value: 'A', label: '通过' },
  { value: 'R', label: '拒绝' },
  { value: 'M', label: '待人工审批' },
];

// 决策结果颜色映射
export const DECISION_COLOR_MAP: Record<string, string> = {
  A: 'green',
  R: 'red',
  M: 'orange',
};

// 流程类型选项
export const FLOW_TYPE_OPTIONS = [
  { value: 'LM', label: '本地模式' },
  { value: 'RD', label: '决策驱动' },
];

// 流程状态选项
export const FLOW_STATE_OPTIONS = [
  { value: 'P', label: '处理中' },
  { value: 'F', label: '已完成' },
];

// 流程任务状态选项
export const FLOW_TASK_STATUS_OPTIONS = [
  { value: 'I', label: '初始' },
  { value: 'U', label: '未分配' },
  { value: 'A', label: '已分配' },
  { value: 'P', label: '处理中' },
  { value: 'W', label: '等待' },
  { value: 'E', label: '异常' },
  { value: 'F', label: '完成' },
];

// 任务状态颜色映射
export const FLOW_TASK_STATUS_COLOR_MAP: Record<string, string> = {
  I: 'default',
  U: 'default',
  A: 'blue',
  P: 'blue',
  W: 'orange',
  E: 'red',
  F: 'green',
};

// 流程步骤状态选项
export const FLOW_STEP_STATUS_OPTIONS = [
  { value: 'P', label: '处理中' },
  { value: 'W', label: '等待中' },
  { value: 'E', label: '异常' },
  { value: 'I', label: '初始' },
  { value: 'S', label: '异常跳过' },
  { value: 'F', label: '完成' },
];

// 流程步骤状态颜色映射
export const FLOW_STEP_STATUS_COLOR_MAP: Record<string, string> = {
  P: 'blue',
  W: 'orange',
  E: 'red',
  I: 'default',
  S: 'purple',
  F: 'green',
};

// 同步任务状态选项
export const SYNC_TASK_STATUS_OPTIONS = [
  { value: 'INIT', label: '初始状态' },
  { value: 'NOT_NEED', label: '无数据或不需要同步' },
  { value: 'SYNCING', label: '处理中' },
  { value: 'SUCCESS', label: '成功' },
  { value: 'FAIL', label: '同步失败' },
  { value: 'EXCEPTION', label: '同步异常' },
  { value: 'FAIL_NOT_REDO', label: '失败但是不进行重试' },
];

// 同步步骤状态选项
export const SYNC_STEP_STATUS_OPTIONS = [
  { value: 'INIT', label: '初始状态' },
  { value: 'NOT_NEED', label: '无数据或不需要同步' },
  { value: 'SYNCING', label: '同步中' },
  { value: 'SUCCESS', label: '成功' },
  { value: 'FAIL', label: '同步失败' },
  { value: 'EXCEPTION', label: '同步异常' },
  { value: 'FAIL_NOT_REDO', label: '失败但是不进行重试' },
];

// 常用正则表达式
export const REG_EXP = {
  /** 匹配纯数字，长度大于 1 */
  NUMBER: /^\d+$/,
  /** 匹配手机号码，长度 11 */
  PHONE: /^1[3|4|5|6|7|8|9]\d{9}$/,
  /** 匹配大小写字母，长度大于 1 */
  LETTER: /^[a-zA-Z]+$/,
  /** 匹配大小写字母或数字，长度大于 1 */
  LETTER_OR_NUMBER: /^[a-zA-Z0-9]+$/,
  LOWERCASE_OR_NUMBER: /^[a-z0-9]+$/,
  /** 匹配中文字符，长度大于 1 */
  CHINESE: /^[\u4E00-\u9FA5]+$/,
  /** 匹配中文字符或大小写字母，长度大于 1 */
  CHINESE_OR_LETTER: /^[\u4E00-\u9FA5a-zA-Z]+$/,
  /** 匹配中文字符或大小写字母或特殊符号，长度大于 1 */
  CHINESE_OR_LETTER_OR_SYMBOL: /^[\u4E00-\u9FA5a-zA-Z_-]+$/,
  /** 匹配数字，包含整数，负数和0 */
  ALL_NUMBER: /^-?\d+(\.\d+)?$/,
  /** 匹配数字和英文逗号 */
  NUMBER_DOT: /^(\d+.?)+$/,
  /** 匹配身份证数字和Xx */
  IDNBR: /^[\dXx]+$/,
  /** 匹配金额，最多两位小数 */
  MONEY: /^(-?\d+)(\.\d{0,2})?$/,
  /** 正数 */
  POS_NUMBER: /^[0-9]*\.?[0-9]+$/,
  /** 邮箱 */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  /** URL */
  URL: /^https?:\/\/.+/,
  /** IP 地址 */
  IP: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
};

// 数字对应中文枚举
export const NUM_CHINESE_ARR = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

// 状态颜色映射
export const STATUS_COLOR_MAP: Record<string, string> = {
  // 流程状态颜色
  RUNNING: 'blue',
  COMPLETED: 'green',
  SUSPENDED: 'orange',
  TERMINATED: 'red',

  // 流程实例状态颜色
  P: 'blue',
  F: 'green',

  // 任务状态颜色
  PENDING: 'blue',
  IN_PROGRESS: 'orange',
  CANCELLED: 'red',

  // 步骤状态颜色
  ACTIVE: 'green',
  INACTIVE: 'orange',
  DEPRECATED: 'red',

  // 优先级颜色
  HIGH: 'red',
  MEDIUM: 'orange',
  LOW: 'green',

  // 审批结果颜色
  A: 'green',
  R: 'red',
  P_APPROVE: 'orange', // 审批结果的处理中状态
};

// 系统常量
export const ADMIN_CODE = 'ADMIN';
export const SYSTEM_DATA_ID = 0;
export const PHOENIX_CONFIG = 'Phoenix:config';
export const PORTAL_MENUS = 'PortalMenus';
export const PORTAL_CURRENT_USER = 'PortalCurrentUser';
export const ROUTER_PREFIX = 'anti-fraud';
export const GLOBAL_STATE = '__QIANKUN_antifraud_GLOBAL_STATE__';

// 文件类型常量
export const FILE_TYPES = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
  TEXT: ['txt', 'md', 'json', 'xml', 'csv'],
  ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz'],
};

// 文件大小限制（字节）
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  TEXT: 1 * 1024 * 1024, // 1MB
  ARCHIVE: 50 * 1024 * 1024, // 50MB
};

// 日期时间格式
export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
  TIMESTAMP: 'YYYY-MM-DD HH:mm:ss.SSS',
};

// 主题配置
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};

// 语言配置
export const LANGUAGE_CONFIG = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US',
};

// 布局配置
export const LAYOUT_CONFIG = {
  SIDE: 'side',
  TOP: 'top',
  MIX: 'mix',
};

// 响应式断点
export const BREAKPOINTS = {
  XS: 480,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1600,
};

// 默认配置
export const DEFAULT_CONFIG = {
  PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MESSAGE_DURATION: 2,
  NOTIFICATION_DURATION: 4.5,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 1000,
};

// 错误代码
export const ERROR_CODES = {
  SUCCESS: '0',
  FAILED: '1',
  UNAUTHORIZED: '401',
  FORBIDDEN: '403',
  NOT_FOUND: '404',
  INTERNAL_ERROR: '500',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
};

// 事件类型
export const EVENT_TYPES = {
  CLICK: 'click',
  CHANGE: 'change',
  SUBMIT: 'submit',
  RESET: 'reset',
  LOAD: 'load',
  ERROR: 'error',
  SUCCESS: 'success',
};

// 存储类型
export const STORAGE_TYPES = {
  LOCAL: 'localStorage',
  SESSION: 'sessionStorage',
  MEMORY: 'memory',
};

// 请求方法
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
};

// 内容类型
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded',
  MULTIPART: 'multipart/form-data',
  TEXT: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml',
};

// 排序方向
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
};

// 过滤操作符
export const FILTER_OPERATORS = {
  EQ: 'eq', // 等于
  NE: 'ne', // 不等于
  GT: 'gt', // 大于
  GTE: 'gte', // 大于等于
  LT: 'lt', // 小于
  LTE: 'lte', // 小于等于
  LIKE: 'like', // 模糊匹配
  IN: 'in', // 包含
  NOT_IN: 'not_in', // 不包含
  BETWEEN: 'between', // 区间
  IS_NULL: 'is_null', // 为空
  IS_NOT_NULL: 'is_not_null', // 不为空
};
