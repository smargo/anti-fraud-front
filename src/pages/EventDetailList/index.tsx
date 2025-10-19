/**
 * EventDetailList 主页面组件
 */

import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import { useDictData } from '@/hooks/useDictData';
import { EventDetailTable, EventDetailModal, EventDetailViewModal } from './components';
import { useEventDetailList } from './hooks/useEventDetailList';
import { handleEventDetailFormSubmit, handleEventDetailDelete } from './helper';
import './index.less';

const EventDetailList: React.FC = () => {
  // 使用字典数据管理Hook
  const { getDictOptions, getDictValueEnum } = useDictData([
    'event_type_option',
    'event_detail_status_option', 
    'event_detail_result_option'
  ]);
  
  // 获取各种选项
  const eventTypeOptions = getDictOptions('event_type_option');
  const statusOptions = getDictOptions('event_detail_status_option');
  const resultOptions = getDictOptions('event_detail_result_option');

  // 获取字典的 valueEnum 格式
  const eventTypeValueEnum = getDictValueEnum('event_type_option');
  const statusValueEnum = getDictValueEnum('event_detail_status_option');
  const resultValueEnum = getDictValueEnum('event_detail_result_option');

  const {
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
  } = useEventDetailList();

  const handleFormSubmit = async (values: any) => {
    await handleEventDetailFormSubmit(values, editingEventDetail, () => {
      reloadTable();
      closeModal();
    });
  };

  const handleDelete = (id: string) => {
    handleEventDetailDelete(id, () => {
      reloadTable();
    });
  };

  return (
    <PageContainer title={false}>
      <ErrorBoundary>
        <div className="eventDetailList">
          <EventDetailTable
            actionRef={actionRef as React.RefObject<ActionType>}
            eventTypeOptions={eventTypeOptions}
            statusOptions={statusOptions}
            resultOptions={resultOptions}
            eventTypeValueEnum={eventTypeValueEnum}
            statusValueEnum={statusValueEnum}
            resultValueEnum={resultValueEnum}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <EventDetailModal
            visible={modalVisible}
            editingEventDetail={editingEventDetail}
            eventTypeOptions={eventTypeOptions}
            statusOptions={statusOptions}
            resultOptions={resultOptions}
            forceReset={forceReset}
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
          />

          <EventDetailViewModal
            visible={viewModalVisible}
            viewingEventDetail={viewingEventDetail}
            eventTypeOptions={eventTypeOptions}
            statusOptions={statusOptions}
            resultOptions={resultOptions}
            onCancel={closeViewModal}
          />
        </div>
      </ErrorBoundary>
    </PageContainer>
  );
};

export default EventDetailList;