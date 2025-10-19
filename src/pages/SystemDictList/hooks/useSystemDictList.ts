/**
 * SystemDictList 页面自定义 Hooks
 */

import { useState, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import type { SystemDictItem } from './types';

export const useSystemDictList = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingDict, setEditingDict] = useState<SystemDictItem | undefined>();
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [viewingDict, setViewingDict] = useState<SystemDictItem | undefined>();
  const [forceReset, setForceReset] = useState(false);
  const actionRef = useRef<ActionType>(null);

  const handleAdd = () => {
    setEditingDict(undefined);
    setForceReset((prev) => !prev);
    setModalVisible(true);
  };

  const handleView = (record: SystemDictItem) => {
    setViewingDict(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record: SystemDictItem) => {
    setEditingDict(record);
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
    editingDict,
    viewModalVisible,
    viewingDict,
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

