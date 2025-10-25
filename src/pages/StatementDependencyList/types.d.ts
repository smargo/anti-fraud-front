/**
 * StatementDependencyList 页面类型定义
 */

export interface StatementDependencyItem {
  id: string;
  eventNo: string;
  versionCode?: string;
  statementNo: string;
  dependStatementNo: string;
  statementDesc?: string;
  dependStatementDesc?: string;
  createdDate: string;
  lastModifiedDate: string;
  createdBy: string;
  lastModifiedBy: string;
}

// 语句依赖表单值
export interface StatementDependencyFormValues {
  statementNo: string;
  dependStatementNo: string;
}
