/**
 * EventList 页面类型定义
 */

export interface EventItem {
  id: string;
  eventNo: string;
  eventName: string;
  eventDesc?: string;
  createdDate: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface EventFormValues {
  eventNo: string;
  eventName: string;
  eventDesc?: string;
}

export interface EventFormProps {
  initialValues?: EventItem | null;
  onSubmit: (values: EventFormValues) => Promise<void>;
  onCancel: () => void;
  forceReset?: boolean;
}
