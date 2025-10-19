/**
 * EventDetail 页面类型定义
 */

export interface EventDetailRecord {
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

export interface EventDetailProps {
  eventTransNo: string;
}

export interface EventDetailViewProps {
  eventDetail: EventDetailRecord | null;
  loading: boolean;
}

