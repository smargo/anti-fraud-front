/**
 * EventDetailList 页面类型定义
 */

export interface EventDetailItem {
  id: string;
  eventTransNo: string;
  eventNo: string;
  eventType: string;
  source: string;
  content: string;
  eventTime: string;
  status: string;
  result: string;
  rejectCode: string;
  resultContent: string;
  processTime: number;
  errorMessage: string;
  retryCount: number;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

export interface EventDetailFormValues {
  eventTransNo: string;
  eventNo: string;
  eventType: string;
  source: string;
  content: string;
  eventTime: string;
  status: string;
  result: string;
  rejectCode?: string;
  resultContent?: string;
  processTime?: number;
  errorMessage?: string;
  retryCount?: number;
}

export interface EventDetailFormProps {
  initialValues?: EventDetailItem | null;
  onSubmit: (values: EventDetailFormValues) => Promise<void>;
  onCancel: () => void;
  eventTypeOptions: any[];
  statusOptions: any[];
  resultOptions: any[];
  forceReset?: boolean;
}

