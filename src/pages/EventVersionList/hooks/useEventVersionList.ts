/**
 * EventVersionList 页面自定义 Hooks
 */

import { useState, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import type { EventVersionItem } from './types';

export const useEventVersionList = () => {
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [viewingVersion, setViewingVersion] = useState<EventVersionItem | null>(null);
  const actionRef = useRef<ActionType>(null);

  const handleView = (record: EventVersionItem) => {
    setViewingVersion(record);
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
    viewingVersion,
    actionRef,
    handleView,
    closeViewModal,
    reloadTable,
  };
};

