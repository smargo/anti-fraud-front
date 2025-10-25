/**
 * StatementDependencyList 页面类型定义
 */

export interface StatementDependencyItem {
  id: string;
  eventNo: string;
  statementNo: string;
  dependStatementNo: string;
  statementDesc?: string;
  dependStatementDesc?: string;
  versionCode?: string;
  createdDate: string;
  lastModifiedDate: string;
  createdBy: string;
  lastModifiedBy: string;
}
