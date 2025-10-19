/**
 * EventDetailList 页面自定义 Hooks
 */

import { useState, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import type { EventDetailItem } from './types';

export const useEventDetailList = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingEventDetail, setEditingEventDetail] = useState<EventDetailItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [viewingEventDetail, setViewingEventDetail] = useState<EventDetailItem | null>(null);
  const [forceReset, setForceReset] = useState(false);
  const actionRef = useRef<ActionType>(null);

  const handleAdd = () => {
    setEditingEventDetail(null);
    setForceReset((prev) => !prev);
    setModalVisible(true);
  };

  const handleView = (record: EventDetailItem) => {
    setViewingEventDetail(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record: EventDetailItem) => {
    setEditingEventDetail(record);
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
    editingEventDetail,
    viewModalVisible,
    viewingEventDetail,
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

