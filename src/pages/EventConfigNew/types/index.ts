/**
 * EventConfig 主类型定义
 */

// 导入其他类型定义
export * from './deriveFieldTypes';
export * from './eventIndicatorTypes';
export * from './fieldTypes';
export * from './stageTypes';
export * from './statementDependencyTypes';

// 事件基本信息
export interface EventDetail {
  id: string;
  eventNo: string;
  eventName: string;
  eventDesc?: string;
  createdDate: string;
}

export interface EventDetailItem {
  code: string;
  message: string;
  data: EventDetail;
}

// 事件配置版本
export interface EventConfigVersion {
  id: string;
  eventNo: string;
  versionCode: string;
  versionDesc: string;
  eventDesc?: string;
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
}

// 事件加载属性
export interface EventLoadProp {
  eventNo: string;
  specifyVersion: EventConfigVersion | null;
}

// Tab类型
export type EventConfigTabKey =
  | 'basic'
  | 'fields'
  | 'derive'
  | 'stages'
  | 'indicators'
  | 'dependencies';

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
  onSelectVersion: (versionId: string) => void;
  onActivateVersion: (versionId: string) => void;
}

// 版本历史弹窗Props
export interface VersionHistoryModalProps {
  visible: boolean;
  eventNo: string;
  versionHistory: EventConfigVersion[];
  versionStatusOptions: any[];
  actionRef: React.RefObject<any>;
  onCancel: () => void;
  onSelectVersion: (versionId: string) => void;
  onActivateVersion: (versionId: string) => void;
  onCopyVersion: (version: EventConfigVersion) => void;
  onRollbackVersion: (versionId: string) => void;
  onDeleteDraftVersion: (versionId: string) => void;
  hasDraftVersion: () => boolean;
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
  versionCode?: string;
  isReadOnly: boolean;
  fieldTypeOptions: any[];
  actionRef?: React.RefObject<any>;
}

// 衍生字段配置Tab Props
export interface DeriveFieldConfigTabProps {
  eventNo: string;
  versionCode?: string;
  isReadOnly: boolean;
  fieldTypeOptions: any[];
  deriveFieldProcessTypeOptions: any[];
  actionRef?: React.RefObject<any>;
}

// 阶段配置Tab Props
export interface StageConfigTabProps {
  eventNo: string;
  versionCode?: string;
  isReadOnly: boolean;
  eventStageOptions: any[];
  stageBeanOptions: any[];
  actionRef?: React.RefObject<any>;
}

// 事件指标配置Tab Props
export interface EventIndicatorConfigTabProps {
  eventNo: string;
  versionCode?: string;
  isReadOnly: boolean;
  actionRef?: React.RefObject<any>;
}

// 语句依赖配置Tab Props
export interface StatementDependencyConfigTabProps {
  eventNo: string;
  versionCode?: string;
  isReadOnly: boolean;
  actionRef?: React.RefObject<any>;
}

// 字段弹窗Props
export interface FieldModalProps {
  visible: boolean;
  editingField: FieldItem | null;
  eventNo: string;
  versionCode: string;
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

// 衍生字段弹窗Props
export interface DeriveFieldModalProps {
  visible: boolean;
  editingDeriveField: DeriveFieldItem | null;
  eventNo: string;
  versionCode: string;
  fieldTypeOptions: any[];
  deriveFieldProcessTypeOptions: any[];
  forceReset: boolean;
  onSubmit: (values: DeriveFieldFormValues) => void;
  onCancel: () => void;
}

// 衍生字段查看弹窗Props
export interface DeriveFieldViewModalProps {
  visible: boolean;
  viewingDeriveField: DeriveFieldItem | null;
  fieldTypeOptions: any[];
  deriveFieldProcessTypeOptions: any[];
  onCancel: () => void;
}

// 阶段弹窗Props
export interface StageModalProps {
  visible: boolean;
  editingStage: StageItem | null;
  eventNo: string;
  versionCode: string;
  eventStageOptions: any[];
  stageBeanOptions: any[];
  forceReset: boolean;
  onSubmit: (values: StageFormValues) => void;
  onCancel: () => void;
}

// 阶段查看弹窗Props
export interface StageViewModalProps {
  visible: boolean;
  viewingStage: StageItem | null;
  eventStageOptions: any[];
  stageBeanOptions: any[];
  onCancel: () => void;
}

// 事件指标弹窗Props
export interface EventIndicatorModalProps {
  visible: boolean;
  editingEventIndicator: EventIndicatorItem | null;
  eventNo: string;
  versionCode: string;
  forceReset: boolean;
  onSubmit: (values: EventIndicatorFormValues) => void;
  onCancel: () => void;
}

// 事件指标查看弹窗Props
export interface EventIndicatorViewModalProps {
  visible: boolean;
  viewingEventIndicator: EventIndicatorItem | null;
  onCancel: () => void;
}

// 语句依赖弹窗Props
export interface StatementDependencyModalProps {
  visible: boolean;
  editingStatementDependency: StatementDependencyItem | null;
  eventNo: string;
  versionCode: string;
  forceReset: boolean;
  onSubmit: (values: StatementDependencyFormValues) => void;
  onCancel: () => void;
}

// 语句依赖查看弹窗Props
export interface StatementDependencyViewModalProps {
  visible: boolean;
  viewingStatementDependency: StatementDependencyItem | null;
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
}

// 通用API响应
export interface ResultPage<T = any> {
  success: boolean;
  total: number;
  data?: T[];
}

// 分页参数
export interface PaginationParams {
  current?: number;
  pageSize?: number;
  [key: string]: any;
}
