/**
 * EventModal 组件
 */

import React from 'react';
import { Modal } from 'antd';
import EventForm from './EventForm';
import type { EventItem, EventFormValues } from '../types';

interface EventModalProps {
  visible: boolean;
  editingEvent: EventItem | null;
  forceReset: boolean;
  onSubmit: (values: EventFormValues) => Promise<void>;
  onCancel: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  visible,
  editingEvent,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  return (
    <Modal
      title={editingEvent ? '编辑事件' : '新增事件'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <EventForm
        initialValues={editingEvent}
        onSubmit={onSubmit}
        onCancel={onCancel}
        forceReset={forceReset}
      />
    </Modal>
  );
};

export default EventModal;

