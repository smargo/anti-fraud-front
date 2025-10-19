/**
 * EventConfig 页面类型定义
 */

export interface EventLoadProp {
  eventNo: string;
  specifyVersion: EventConfigVersion | null;
}

export interface EventConfigVersion {
  id: number;
  versionCode: string;
  versionDesc?: string;
  status: 'DRAFT' | 'ACTIVE' | 'APPROVED' | 'ARCHIVED';
  createdDate: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface EventConfigVersionInfo {
  versionHistory: EventConfigVersion[];
  hasUnsavedChanges: boolean;
}

export interface FieldItem {
  id: number;
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

export interface DeriveFieldItem {
  id: number;
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

export interface StageItem {
  id: number;
  eventNo: string;
  versionCode: string;
  stageNo: string;
  stageName: string;
  stageBean?: string;
  stageParam?: string;
  createdDate: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface StatementDependencyItem {
  id: number;
  eventNo: string;
  versionCode: string;
  statementNo: string;
  statementDesc?: string;
  dependStatementNo: string;
  dependStatementDesc?: string;
  enable: 'Y' | 'N';
  createdDate: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface EventIndicatorItem {
  id: number;
  eventNo: string;
  versionCode: string;
  indicatorNo: string;
  indicatorName?: string;
  indicatorDesc?: string;
  createdDate: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface EventDetail {
  id: string;
  eventNo: string;
  eventName: string;
  eventType?: string;
  eventGroup?: string;
  eventDesc?: string;
  createdDate: string;
  lastModifiedDate: string;
}

