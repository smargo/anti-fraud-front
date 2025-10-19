/**
 * EventList 主页面组件
 */

import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { Card } from 'antd';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import { EventTable, EventModal } from './components';
import { useEventList } from './hooks/useEventList';
import { handleEventFormSubmit } from './helper';
import './index.less';

const EventList: React.FC = () => {
  const {
    modalVisible,
    editingEvent,
    forceReset,
    actionRef,
    handleAdd,
    handleEdit,
    closeModal,
    reloadTable,
  } = useEventList();

  const handleFormSubmit = async (values: any) => {
    await handleEventFormSubmit(values, editingEvent, () => {
      reloadTable();
      closeModal();
    });
  };

  const handleDelete = (id: string) => {
    reloadTable();
  };

  return (
    <PageContainer title={false}>
      <ErrorBoundary>
        <Card>
          <EventTable
            actionRef={actionRef as React.RefObject<ActionType>}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <EventModal
            visible={modalVisible}
            editingEvent={editingEvent}
            forceReset={forceReset}
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
          />
        </Card>
      </ErrorBoundary>
    </PageContainer>
  );
};

export default EventList;