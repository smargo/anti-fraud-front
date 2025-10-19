/**
 * 阶段配置相关类型定义
 */

// 阶段项
export interface StageItem {
  id: string;
  eventNo: string;
  stageName: string;
  stageDesc: string;
  stageOrder: number;
  stageNo: string;
  stageBean: string;
  stageParam: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

// 阶段表单值
export interface StageFormValues {
  stageName: string;
  stageDesc: string;
  stageOrder: number;
  stageNo: string;
  stageBean: string;
  stageParam: string;
}

// 阶段配置状态
export interface StageConfigState {
  stages: StageItem[];
  loading: boolean;
  modalVisible: boolean;
  editingStage: StageItem | null;
  viewModalVisible: boolean;
  viewingStage: StageItem | null;
  forceReset: boolean;
}
