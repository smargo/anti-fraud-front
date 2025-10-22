/**
 * 衍生字段相关类型定义
 */

// 衍生字段项
export interface DeriveFieldItem {
  id: string;
  eventNo: string;
  versionCode: string;
  fieldName: string;
  fieldType: string;
  fieldDesc?: string;
  processType: string;
  processScript: string;
  processBean: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

// 衍生字段表单值
export interface DeriveFieldFormValues {
  fieldName: string;
  fieldType: string;
  fieldDesc?: string;
  processType: string;
  processScript: string;
  processBean: string;
}

// 衍生字段配置状态
export interface DeriveFieldConfigState {
  deriveFields: DeriveFieldItem[];
  loading: boolean;
  modalVisible: boolean;
  editingDeriveField: DeriveFieldItem | null;
  viewModalVisible: boolean;
  viewingDeriveField: DeriveFieldItem | null;
  forceReset: boolean;
}
