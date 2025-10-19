/**
 * StatementList 页面自定义 Hooks
 */

import { useState, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import type { StatementItem } from '../types';

export const useStatementList = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingStatement, setEditingStatement] = useState<StatementItem | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [viewingStatement, setViewingStatement] = useState<StatementItem | null>(null);
  const [forceReset, setForceReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const actionRef = useRef<ActionType>(null);

  const handleAdd = () => {
    setEditingStatement(null);
    setForceReset((prev) => !prev);
    setModalVisible(true);
  };

  const handleView = (record: StatementItem) => {
    setViewingStatement(record);
    setViewModalVisible(true);
  };

  const handleEdit = (record: StatementItem) => {
    setEditingStatement(record);
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
    editingStatement,
    viewModalVisible,
    viewingStatement,
    forceReset,
    loading,
    actionRef,
    handleAdd,
    handleView,
    handleEdit,
    closeModal,
    closeViewModal,
    reloadTable,
  };
};

