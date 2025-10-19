/**
 * FieldList 页面类型定义
 */

export interface FieldItem {
  id?: number;
  eventNo: string;
  versionCode: string;
  fieldName: string;
  fieldType: string;
  fieldDesc?: string;
  validateScript?: string;
  createdDate: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface FieldFormValues {
  eventNo: string;
  versionCode: string;
  fieldName: string;
  fieldType: string;
  fieldDesc?: string;
  validateScript?: string;
}

export interface FieldFormProps {
  initialValues?: FieldItem | null;
  onSubmit: (values: FieldFormValues) => Promise<void>;
  onCancel: () => void;
  fieldTypeOptions: any[];
  isEdit?: boolean;
  forceReset?: boolean;
}

