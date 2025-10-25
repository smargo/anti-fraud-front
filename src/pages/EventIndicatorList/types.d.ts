/**
 * EventIndicatorList 页面类型定义
 */

export interface EventIndicatorItem {
  id?: string;
  eventNo: string;
  versionCode: string;
  eventName?: string;
  indicatorNo: string;
  indicatorName: string;
  createdDate: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}
