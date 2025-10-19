/**
 * IndicatorModal 组件
 */

import React from 'react';
import { Modal } from 'antd';
import IndicatorForm from './IndicatorForm';
import type { IndicatorItem, IndicatorFormValues } from '../types';

interface IndicatorModalProps {
  visible: boolean;
  editingIndicator: IndicatorItem | null;
  forceReset: boolean;
  onSubmit: (values: IndicatorFormValues) => Promise<void>;
  onCancel: () => void;
}

const IndicatorModal: React.FC<IndicatorModalProps> = ({
  visible,
  editingIndicator,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  return (
    <Modal
      title={editingIndicator ? '编辑指标' : '新增指标'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <IndicatorForm
        initialValues={editingIndicator}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isEdit={!!editingIndicator}
        forceReset={forceReset}
      />
    </Modal>
  );
};

export default IndicatorModal;

