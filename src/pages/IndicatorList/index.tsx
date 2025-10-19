/**
 * IndicatorList 主页面组件
 */

import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import { IndicatorTable, IndicatorModal, IndicatorViewModal } from './components';
import { useIndicatorList } from './hooks/useIndicatorList';
import { handleIndicatorFormSubmit, handleIndicatorDelete } from './helper';
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

  const handleDelete = (indicatorNo: string) => {
    handleIndicatorDelete(indicatorNo, () => {
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