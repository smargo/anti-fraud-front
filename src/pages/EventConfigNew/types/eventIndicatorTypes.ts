/**
 * 事件指标相关类型定义
 */

// 事件指标项
export interface EventIndicatorItem {
  id: string;
  eventNo: string;
  versionCode: string;
  eventName?: string;
  indicatorNo: string;
  indicatorName: string;
  createdDate: string;
}

// 事件指标表单值
export interface EventIndicatorFormValues {
  indicatorNo: string;
}

// 事件指标配置状态
export interface EventIndicatorConfigState {
  eventIndicators: EventIndicatorItem[];
  loading: boolean;
  modalVisible: boolean;
  editingEventIndicator: EventIndicatorItem | null;
  viewModalVisible: boolean;
  viewingEventIndicator: EventIndicatorItem | null;
  forceReset: boolean;
}
