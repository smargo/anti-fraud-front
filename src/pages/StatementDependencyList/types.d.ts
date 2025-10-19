/**
 * StatementDependencyList 页面类型定义
 */

export interface StatementDependencyItem {
  id?: number;
  eventNo: string;
  versionCode: string;
  dependencyNo: string;
  dependencyName: string;
  dependencyDesc?: string;
  dependencyType: string;
  dependencyContent?: string;
  createdDate: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface StatementDependencyFormValues {
  eventNo: string;
  versionCode: string;
  dependencyNo: string;
  dependencyName: string;
  dependencyDesc?: string;
  dependencyType: string;
  dependencyContent?: string;
}

export interface StatementDependencyFormProps {
  initialValues?: StatementDependencyItem | null;
  onSubmit: (values: StatementDependencyFormValues) => Promise<void>;
  onCancel: () => void;
  dependencyTypeOptions: any[];
  isEdit?: boolean;
  forceReset?: boolean;
}

