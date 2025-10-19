/**
 * EventIndicatorList 页面自定义 Hooks
 */

import { useState, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import type { EventIndicatorItem } from '../types';

export const useEventIndicatorList = () => {
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [viewingEventIndicator, setViewingEventIndicator] = useState<EventIndicatorItem | null>(null);
  const actionRef = useRef<ActionType>(null);

  const handleView = (record: EventIndicatorItem) => {
    setViewingEventIndicator(record);
    setViewModalVisible(true);
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
  };

  const reloadTable = () => {
    actionRef.current?.reload();
  };

  return {
    viewModalVisible,
    viewingEventIndicator,
    actionRef,
    handleView,
    closeViewModal,
    reloadTable,
  };
};

