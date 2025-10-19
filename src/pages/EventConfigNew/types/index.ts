/**
 * EventConfig 主类型定义
 */

// 事件基本信息
export interface EventDetail {
  id: string;
  eventNo: string;
  eventName: string;
  eventDesc?: string;
  createdDate: string;
}

// 事件配置版本
export interface EventConfigVersion {
  id: string;
  eventNo: string;
  versionCode: string;
  eventType: string;
  eventGroup: string;
  status: 'DRAFT' | 'ACTIVE' | 'APPROVED' | 'ARCHIVED';
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

// 版本信息
export interface EventConfigVersionInfo {
  versionHistory: EventConfigVersion[];
  hasUnsavedChanges: boolean;
}

// 事件加载属性
export interface EventLoadProp {
  eventNo: string;
  specifyVersion: EventConfigVersion | null;
}

// Tab类型
export type EventConfigTabKey = 'basic' | 'fields' | 'derive' | 'stages' | 'indicators' | 'dependencies';

// 版本控制相关
export interface VersionControlState {
  currentVersion: EventConfigVersion | null;
  isDraftMode: boolean;
  isReadOnly: boolean;
  versionInfo: EventConfigVersionInfo;
  versionHistoryVisible: boolean;
  createVersionModalVisible: boolean;
  copyVersionModalVisible: boolean;
  copyingVersion: EventConfigVersion | null;
}

// 版本控制组件Props
export interface VersionControlProps {
  eventNo: string;
  currentVersion: EventConfigVersion | null;
  isDraftMode: boolean;
  isReadOnly: boolean;
  versionInfo: EventConfigVersionInfo;
  onCreateDraft: () => void;
  onShowVersionHistory: () => void;
  onShowCreateVersionModal: () => void;
}

// 版本历史弹窗Props
export interface VersionHistoryModalProps {
  visible: boolean;
  eventNo: string;
  versionHistory: EventConfigVersion[];
  actionRef: React.RefObject<any>;
  onCancel: () => void;
  onCopyVersion: (version: EventConfigVersion) => void;
}

// 创建版本弹窗Props
export interface CreateVersionModalProps {
  visible: boolean;
  eventNo: string;
  onCancel: () => void;
  onSuccess: () => void;
}

// 复制版本弹窗Props
export interface CopyVersionModalProps {
  visible: boolean;
  eventNo: string;
  sourceVersion: EventConfigVersion | null;
  onCancel: () => void;
  onSuccess: () => void;
}

// 基础信息Tab Props
export interface BasicInfoTabProps {
  eventDetail: EventDetail | null;
  currentVersion: EventConfigVersion | null;
  isReadOnly: boolean;
  configEventLoadProp: EventLoadProp | null;
  eventTypeOptions: any[];
  eventGroupOptions: any[];
  onVersionUpdate?: () => void;
}

// 字段配置Tab Props
export interface FieldConfigTabProps {
  eventNo: string;
  versionId?: string;
  isReadOnly: boolean;
  fieldTypeOptions: any[];
}

// 字段弹窗Props
export interface FieldModalProps {
  visible: boolean;
  editingField: FieldItem | null;
  fieldTypeOptions: any[];
  forceReset: boolean;
  onSubmit: (values: FieldFormValues) => void;
  onCancel: () => void;
}

// 字段查看弹窗Props
export interface FieldViewModalProps {
  visible: boolean;
  viewingField: FieldItem | null;
  fieldTypeOptions: any[];
  onCancel: () => void;
}

// 指标详情相关
export interface IndicatorDetailState {
  indicatorDetailVisible: boolean;
  selectedIndicator: any | null;
  selectedStatement: any | null;
  selectedDataSource: any | null;
}

// 表单相关
export interface BasicInfoFormValues {
  eventNo: string;
  eventName: string;
  eventType: string;
  eventGroup: string;
}

// 通用API响应
export interface ApiResponse<T = any> {
  code: string;
  message: string;
  data?: T;
  records?: T[];
  total?: number;
  success?: boolean;
}

// 分页参数
export interface PaginationParams {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}
