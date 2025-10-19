/**
 * EventList 页面自定义 Hooks
 */

import { useState, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import type { EventItem } from './types';

export const useEventList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [forceReset, setForceReset] = useState(false);
  const actionRef = useRef<ActionType>(null);

  const handleAdd = () => {
    setEditingEvent(null);
    setForceReset((prev) => !prev);
    setModalVisible(true);
  };

  const handleEdit = (record: EventItem) => {
    setEditingEvent(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const reloadTable = () => {
    actionRef.current?.reload();
  };

  return {
    modalVisible,
    editingEvent,
    forceReset,
    actionRef,
    handleAdd,
    handleEdit,
    closeModal,
    reloadTable,
  };
};

