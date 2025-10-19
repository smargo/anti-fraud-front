/**
 * StatementList 主页面组件
 */

import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import { useDictData } from '@/hooks/useDictData';
import { StatementTable, StatementModal, StatementViewModal } from './components';
import { useStatementList } from './hooks/useStatementList';
import { handleStatementFormSubmit, handleStatementDelete } from './helper';
import './index.less';

const StatementList: React.FC = () => {
  // 使用字典数据管理Hook
  const { getDictOptions } = useDictData(['mongo_operate_option']);
  
  // 获取MongoDB操作选项
  const mongoOperateOptions = getDictOptions('mongo_operate_option');

  const {
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
  } = useStatementList();

  const handleFormSubmit = async (values: any) => {
    await handleStatementFormSubmit(values, editingStatement, () => {
      reloadTable();
      closeModal();
    });
  };

  const handleDelete = (id: number) => {
    handleStatementDelete(id, () => {
      reloadTable();
    });
  };

  return (
    <PageContainer title={false}>
      <ErrorBoundary>
        <div className="statementList">
          <StatementTable
            actionRef={actionRef as React.RefObject<ActionType>}
            mongoOperateOptions={mongoOperateOptions}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <StatementModal
            visible={modalVisible}
            editingStatement={editingStatement}
            mongoOperateOptions={mongoOperateOptions}
            loading={loading}
            forceReset={forceReset}
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
          />

          <StatementViewModal
            visible={viewModalVisible}
            viewingStatement={viewingStatement}
            mongoOperateOptions={mongoOperateOptions}
            onCancel={closeViewModal}
          />
        </div>
      </ErrorBoundary>
    </PageContainer>
  );
};

export default StatementList;