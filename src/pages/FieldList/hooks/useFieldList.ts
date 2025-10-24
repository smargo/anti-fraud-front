/**
 * FieldList 页面自定义 Hooks
 */

import type { ActionType } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import type { FieldItem } from '../types';

export const useFieldList = () => {
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [viewingField, setViewingField] = useState<FieldItem | null>(null);
  const actionRef = useRef<ActionType>(null);

  const handleView = (record: FieldItem) => {
    setViewingField(record);
    setViewModalVisible(true);
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
  };

  return {
    viewModalVisible,
    viewingField,
    actionRef,
    handleView,
    closeViewModal,
  };
};
