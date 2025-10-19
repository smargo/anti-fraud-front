/**
 * StatementList 页面类型定义
 */

export interface StatementItem {
  id?: number;
  statementNo: string;
  statementDesc?: string;
  dataSourceNo?: string;
  beanId?: string;
  statementString?: string;
  statementParam?: string;
  resultList?: string;

  mongoOperationType?: string;
  mongoDatabase?: string;
  mongoCollection?: string;
  
  createdDate: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface StatementFormValues {
  statementNo: string;
  statementDesc?: string;
  dataSourceNo: string;
  beanId: string;
  statementString: string;
  statementParam: string;
  resultList: string;
  mongoOperationType?: string;
  mongoDatabase?: string;
  mongoCollection?: string;
}

export interface StatementFormProps {
  initialValues?: StatementItem | null;
  onSubmit: (values: StatementFormValues) => Promise<void>;
  onCancel: () => void;
  mongoOperateOptions: any[];
  loading?: boolean;
  forceReset?: boolean;
}

