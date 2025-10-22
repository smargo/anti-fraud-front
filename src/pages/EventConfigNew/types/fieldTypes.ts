/**
 * 字段配置相关类型定义
 */

// 字段项
export interface FieldItem {
  id: string;
  eventNo: string;
  versionCode: string;
  fieldName: string;
  fieldType: string;
  fieldDesc: string;
  validateRegex: string;
  validateScript: string;
  required: boolean;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

// 字段表单值
export interface FieldFormValues {
  fieldName: string;
  fieldType: string;
  fieldDesc: string;
  validateRegex: string;
  validateScript: string;
  required: boolean;
}

// 字段配置状态
export interface FieldConfigState {
  fields: FieldItem[];
  loading: boolean;
  modalVisible: boolean;
  editingField: FieldItem | null;
  viewModalVisible: boolean;
  viewingField: FieldItem | null;
  forceReset: boolean;
}
