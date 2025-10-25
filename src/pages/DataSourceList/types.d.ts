/**
 * DataSourceList 页面类型定义
 */

export interface DataSourceItem {
  id?: string;
  dataSourceNo: string;
  dataSourceName: string;
  dataSourceType: string;
  dataSourceUserName?: string;
  dataSourcePassword?: string;
  dataSourceConnectString: string;
  dataSourceParam?: string;
  createdDate: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface DataSourceQueryVO {
  dataSourceNo?: string;
  dataSourceName?: string;
  dataSourceType?: string;
  keyword?: string;
  current?: number;
  pageSize?: number;
}

export interface DataSourceFormValues {
  dataSourceNo: string;
  dataSourceName: string;
  dataSourceType: string;
  dataSourceUserName?: string;
  dataSourcePassword?: string;
  dataSourceConnectString: string;
  dataSourceParam?: string;
}

export interface DataSourceFormProps {
  initialValues?: DataSourceItem | null;
  onSubmit: (values: DataSourceFormValues) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
  forceReset?: boolean;
}
