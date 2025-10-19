/**
 * 语句依赖相关类型定义
 */

// 语句依赖项
export interface StatementDependencyItem {
  id: string;
  eventNo: string;
  versionCode: string;
  statementNo: string;
  statementDesc?: string;
  dependStatementNo: string;
  dependStatementDesc?: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

// 语句依赖表单值
export interface StatementDependencyFormValues {
  statementNo: string;
  dependStatementNo: string;
}

// 语句依赖配置状态
export interface StatementDependencyConfigState {
  statementDependencies: StatementDependencyItem[];
  loading: boolean;
  modalVisible: boolean;
  editingStatementDependency: StatementDependencyItem | null;
  viewModalVisible: boolean;
  viewingStatementDependency: StatementDependencyItem | null;
  forceReset: boolean;
}
