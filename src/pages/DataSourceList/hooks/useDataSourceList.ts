/**
 * DataSourceList 页面自定义 Hooks
 */

import type { ActionType } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import type { DataSourceItem } from '../types';

export const useDataSourceList = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingDataSource, setEditingDataSource] = useState<DataSourceItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [viewingDataSource, setViewingDataSource] = useState<DataSourceItem | null>(null);
  const [forceReset, setForceReset] = useState(false);
  const actionRef = useRef<ActionType>(null);

  const handleAdd = () => {
    setEditingDataSource(null);
    setForceReset((prev) => !prev);
    setModalVisible(true);
  };

  const handleView = (record: DataSourceItem) => {
    setViewingDataSource(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record: DataSourceItem) => {
    setEditingDataSource(record);
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
    editingDataSource,
    viewModalVisible,
    viewingDataSource,
    forceReset,
    actionRef: actionRef as React.RefObject<ActionType>,
    handleAdd,
    handleView,
    handleEdit,
    closeModal,
    closeViewModal,
    reloadTable,
  };
};
