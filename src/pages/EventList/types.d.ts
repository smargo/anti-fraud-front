/**
 * EventList 页面类型定义
 */

export interface EventItem {
  id: string;
  eventNo: string;
  eventName: string;
  eventDesc?: string;
  createdDate: string;
  lastModifiedDate: string;
}

export interface EventFormValues {
  eventNo: string;
  eventName: string;
  eventDesc?: string;
}

export interface EventListProps {
  // 如果需要传递 props，在这里定义
}

export interface EventFormProps {
  initialValues?: EventItem | null;
  onSubmit: (values: EventFormValues) => Promise<void>;
  onCancel: () => void;
  forceReset?: boolean;
}

