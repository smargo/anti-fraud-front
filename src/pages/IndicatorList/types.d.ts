/**
 * IndicatorList 页面类型定义
 */

export interface IndicatorItem {
  id: string;
  indicatorNo: string;
  indicatorName: string;
  indicatorDesc: string;
  indicatorField: string;
  queryField: string;
  queryNo: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

export interface IndicatorFormValues {
  indicatorNo: string;
  indicatorName: string;
  indicatorDesc?: string;
  indicatorField: string;
  queryField: string;
  queryNo: string;
}

export interface IndicatorFormProps {
  initialValues?: IndicatorItem | null;
  onSubmit: (values: IndicatorFormValues) => void;
  onCancel: () => void;
  forceReset?: boolean;
}

