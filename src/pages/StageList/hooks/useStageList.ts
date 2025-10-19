/**
 * StageList 页面自定义 Hooks
 */

import { useState, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import type { StageItem } from './types';

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

