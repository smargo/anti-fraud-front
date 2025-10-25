/**
 * 衍生字段相关类型定义
 */

// 衍生字段表单值
export interface DeriveFieldFormValues {
  fieldName: string;
  fieldType: string;
  fieldDesc?: string;
  processType: string;
  processScript: string;
  processBean: string;
}
