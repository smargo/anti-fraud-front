/**
 * EventDetailModal 组件
 */

import React from 'react';
import { Modal } from 'antd';
import EventDetailForm from './EventDetailForm';
import type { EventDetailItem, EventDetailFormValues } from '../types';

interface EventDetailModalProps {
  visible: boolean;
  editingEventDetail: EventDetailItem | null;
  eventTypeOptions: any[];
  statusOptions: any[];
  resultOptions: any[];
  forceReset: boolean;
  onSubmit: (values: EventDetailFormValues) => Promise<void>;
  onCancel: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  visible,
  editingEventDetail,
  eventTypeOptions,
  statusOptions,
  resultOptions,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  return (
    <Modal
      title={editingEventDetail ? '编辑事件详情' : '新增事件详情'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <EventDetailForm
        initialValues={editingEventDetail}
        onSubmit={onSubmit}
        onCancel={onCancel}
        eventTypeOptions={eventTypeOptions}
        statusOptions={statusOptions}
        resultOptions={resultOptions}
        forceReset={forceReset}
      />
    </Modal>
  );
};

export default EventDetailModal;

