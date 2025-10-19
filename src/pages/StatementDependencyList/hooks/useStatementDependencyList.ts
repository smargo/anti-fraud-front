/**
 * StatementDependencyList 页面自定义 Hooks
 */

import { useState, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import type { StatementDependencyItem } from '../types';

export const useStatementDependencyList = () => {
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [viewingStatementDependency, setViewingStatementDependency] = useState<StatementDependencyItem | null>(null);
  const actionRef = useRef<ActionType>(null);

  const handleView = (record: StatementDependencyItem) => {
    setViewingStatementDependency(record);
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
    viewingStatementDependency,
    actionRef,
    handleView,
    closeViewModal,
    reloadTable,
  };
};

