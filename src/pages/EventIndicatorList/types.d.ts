/**
 * EventIndicatorList 页面类型定义
 */

export interface EventIndicatorItem {
  id?: number;
  eventNo: string;
  versionCode: string;
  indicatorName: string;
  indicatorType: string;
  indicatorDesc?: string;
  indicatorFormula?: string;
  createdDate: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface EventIndicatorFormValues {
  eventNo: string;
  versionCode: string;
  indicatorName: string;
  indicatorType: string;
  indicatorDesc?: string;
  indicatorFormula?: string;
}

export interface EventIndicatorFormProps {
  initialValues?: EventIndicatorItem | null;
  onSubmit: (values: EventIndicatorFormValues) => Promise<void>;
  onCancel: () => void;
  indicatorTypeOptions: any[];
  isEdit?: boolean;
  forceReset?: boolean;
}

