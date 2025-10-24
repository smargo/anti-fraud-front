/**
 * IndicatorList 主页面组件
 */

import ErrorBoundary from '@/components/Common/ErrorBoundary';
import type { ActionType } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import { IndicatorModal, IndicatorTable, IndicatorViewModal } from './components';
import { handleIndicatorDelete, handleIndicatorFormSubmit } from './helper';
import { useIndicatorList } from './hooks/useIndicatorList';
import './index.less';

const IndicatorList: React.FC = () => {
  const {
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
  } = useIndicatorList();

  const handleFormSubmit = async (values: any) => {
    await handleIndicatorFormSubmit(values, editingIndicator, () => {
      reloadTable();
      closeModal();
    });
  };

  const handleDelete = (indicatorId: number) => {
    handleIndicatorDelete(indicatorId, () => {
      reloadTable();
    });
  };

  return (
    <PageContainer title={false}>
      <ErrorBoundary>
        <div className="indicatorList">
          <IndicatorTable
            actionRef={actionRef as React.RefObject<ActionType>}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <IndicatorModal
            visible={modalVisible}
            editingIndicator={editingIndicator}
            forceReset={forceReset}
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
          />

          <IndicatorViewModal
            visible={viewModalVisible}
            viewingIndicator={viewingIndicator}
            onCancel={closeViewModal}
          />
        </div>
      </ErrorBoundary>
    </PageContainer>
  );
};

export default IndicatorList;
