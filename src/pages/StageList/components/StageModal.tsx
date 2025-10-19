/**
 * StageModal 组件
 */

import React from 'react';
import { Modal } from 'antd';
import StageForm from './StageForm';
import type { StageItem, StageFormValues } from '../types';

interface StageModalProps {
  visible: boolean;
  editingStage: StageItem | null;
  stageBeanOptions: any[];
  forceReset: boolean;
  onSubmit: (values: StageFormValues) => Promise<void>;
  onCancel: () => void;
}

const StageModal: React.FC<StageModalProps> = ({
  visible,
  editingStage,
  stageBeanOptions,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  return (
    <Modal
      title={editingStage ? '编辑阶段' : '新增阶段'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <StageForm
        initialValues={editingStage}
        onSubmit={onSubmit}
        onCancel={onCancel}
        stageBeanOptions={stageBeanOptions}
        isEdit={!!editingStage}
        forceReset={forceReset}
      />
    </Modal>
  );
};

export default StageModal;

