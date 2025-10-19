/**
 * EventIndicatorModal 组件
 */

import React from 'react';
import { Modal } from 'antd';
import EventIndicatorForm from './EventIndicatorForm';
import type { EventIndicatorItem, EventIndicatorFormValues } from '../types';

interface EventIndicatorModalProps {
  visible: boolean;
  editingEventIndicator: EventIndicatorItem | null;
  indicatorTypeOptions: any[];
  forceReset: boolean;
  onSubmit: (values: EventIndicatorFormValues) => Promise<void>;
  onCancel: () => void;
}

const EventIndicatorModal: React.FC<EventIndicatorModalProps> = ({
  visible,
  editingEventIndicator,
  indicatorTypeOptions,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  return (
    <Modal
      title={editingEventIndicator ? '编辑事件指标' : '新增事件指标'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <EventIndicatorForm
        initialValues={editingEventIndicator}
        onSubmit={onSubmit}
        onCancel={onCancel}
        indicatorTypeOptions={indicatorTypeOptions}
        isEdit={!!editingEventIndicator}
        forceReset={forceReset}
      />
    </Modal>
  );
};

export default EventIndicatorModal;

