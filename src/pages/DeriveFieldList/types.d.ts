/**
 * DeriveFieldList 页面类型定义
 */

export interface DeriveFieldItem {
  id?: number;
  eventNo: string;
  versionCode: string;
  fieldName: string;
  fieldType: string;
  fieldDesc?: string;
  processType: string;
  processBean?: string;
  processScript?: string;
  createdDate: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface DeriveFieldFormValues {
  eventNo: string;
  versionCode: string;
  fieldName: string;
  fieldType: string;
  fieldDesc?: string;
  processType: string;
  processBean?: string;
  processScript?: string;
}

export interface DeriveFieldFormProps {
  initialValues?: DeriveFieldItem | null;
  onSubmit: (values: DeriveFieldFormValues) => Promise<void>;
  onCancel: () => void;
  fieldTypeOptions: any[];
  processTypeOptions: any[];
  isEdit?: boolean;
  forceReset?: boolean;
}

