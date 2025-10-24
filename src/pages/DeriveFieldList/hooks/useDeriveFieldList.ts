/**
 * DeriveFieldList 页面自定义 Hooks
 */

import type { ActionType } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import type { DeriveFieldItem } from '../types';

export const useDeriveFieldList = () => {
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [viewingDeriveField, setViewingDeriveField] = useState<DeriveFieldItem | null>(null);
  const actionRef = useRef<ActionType>(null);

  const handleView = (record: DeriveFieldItem) => {
    setViewingDeriveField(record);
    setViewModalVisible(true);
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
  };

  return {
    viewModalVisible,
    viewingDeriveField,
    actionRef,
    handleView,
    closeViewModal,
  };
};
