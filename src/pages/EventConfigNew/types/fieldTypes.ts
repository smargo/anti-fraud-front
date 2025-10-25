/**
 * 字段配置相关类型定义
 */
import { FieldItem } from '@/pages/FieldList/types';

// 字段配置状态
export interface FieldConfigState {
  fields: FieldItem[];
  loading: boolean;
  modalVisible: boolean;
  editingField: FieldItem | null;
  viewModalVisible: boolean;
  viewingField: FieldItem | null;
  forceReset: boolean;
}
