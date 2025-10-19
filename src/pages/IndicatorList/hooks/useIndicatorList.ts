/**
 * IndicatorList 页面自定义 Hooks
 */

import { useState, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import type { IndicatorItem } from './types';

export const useIndicatorList = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingIndicator, setEditingIndicator] = useState<IndicatorItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [viewingIndicator, setViewingIndicator] = useState<IndicatorItem | null>(null);
  const [forceReset, setForceReset] = useState(false);
  const actionRef = useRef<ActionType>(null);

  const handleAdd = () => {
    setEditingIndicator(null);
    setForceReset((prev) => !prev);
    setModalVisible(true);
  };

  const handleView = (record: IndicatorItem) => {
    setViewingIndicator(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record: IndicatorItem) => {
    setEditingIndicator(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
  };

  const reloadTable = () => {
    actionRef.current?.reload();
  };

  return {
    modalVisible,
    editingIndicator,
    viewModalVisible,
    viewingIndicator,
    forceReset,
    actionRef,
    handleAdd,
    handleView,
    handleEdit,
    closeModal,
    closeViewModal,
    reloadTable,
  };
};

