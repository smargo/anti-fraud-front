/**
 * SystemDictList 主页面组件
 */

import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import { useDictData } from '@/hooks/useDictData';
import type { DictItem } from '@/utils/dictUtils';
import { SystemDictTable, SystemDictModal, SystemDictViewModal } from './components';
import { useSystemDictList } from './hooks/useSystemDictList';
import { handleDictFormSubmit, handleDictDelete, handleDictRefresh } from './helper';
import './index.less';

const SystemDictList: React.FC = () => {
  // 使用字典数据管理Hook
  const { getDictOptions } = useDictData(['enable_option']);
  
  // 获取启用选项
  const enableOptions = getDictOptions('enable_option') as DictItem[];

  const {
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
  } = useSystemDictList();

  const handleFormSubmit = async (values: any) => {
    await handleDictFormSubmit(values, editingDict, () => {
      reloadTable();
      closeModal();
    });
  };

  const handleDelete = (id: number) => {
    handleDictDelete(id, () => {
      reloadTable();
    });
  };

  const handleRefresh = () => {
    handleDictRefresh(() => {
      reloadTable();
    });
  };

  return (
    <PageContainer title={false}>
      <ErrorBoundary>
        <div className="systemDictList">
          <SystemDictTable
            actionRef={actionRef as React.RefObject<ActionType>}
            enableOptions={enableOptions}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={handleRefresh}
          />

          <SystemDictModal
            visible={modalVisible}
            editingDict={editingDict}
            forceReset={forceReset}
            enableOptions={enableOptions}
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
          />

          <SystemDictViewModal
            visible={viewModalVisible}
            viewingDict={viewingDict}
            enableOptions={enableOptions}
            onCancel={closeViewModal}
          />
        </div>
      </ErrorBoundary>
    </PageContainer>
  );
};

export default SystemDictList;