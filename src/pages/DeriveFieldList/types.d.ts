/**
 * DeriveFieldList 页面类型定义
 */

export interface DeriveFieldItem {
  id?: string;
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
