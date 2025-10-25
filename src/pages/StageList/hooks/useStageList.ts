/**
 * StageList 页面自定义 Hooks
 */

import type { ActionType } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import type { StageItem } from '../types';

export const useStageList = () => {
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [viewingStage, setViewingStage] = useState<StageItem | null>(null);
  const actionRef = useRef<ActionType>(null);

  const handleView = (record: StageItem) => {
    setViewingStage(record);
    setViewModalVisible(true);
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
  };

  return {
    viewModalVisible,
    viewingStage,
    actionRef,
    handleView,
    closeViewModal,
  };
};
