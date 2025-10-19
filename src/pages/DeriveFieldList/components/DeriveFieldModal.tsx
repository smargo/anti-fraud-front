/**
 * DeriveFieldModal 组件
 */

import React from 'react';
import { Modal } from 'antd';
import DeriveFieldForm from './DeriveFieldForm';
import type { DeriveFieldItem, DeriveFieldFormValues } from '../types';

interface DeriveFieldModalProps {
  visible: boolean;
  editingDeriveField: DeriveFieldItem | null;
  fieldTypeOptions: any[];
  processTypeOptions: any[];
  forceReset: boolean;
  onSubmit: (values: DeriveFieldFormValues) => Promise<void>;
  onCancel: () => void;
}

const DeriveFieldModal: React.FC<DeriveFieldModalProps> = ({
  visible,
  editingDeriveField,
  fieldTypeOptions,
  processTypeOptions,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  return (
    <Modal
      title={editingDeriveField ? '编辑衍生字段' : '新增衍生字段'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <DeriveFieldForm
        initialValues={editingDeriveField}
        onSubmit={onSubmit}
        onCancel={onCancel}
        fieldTypeOptions={fieldTypeOptions}
        processTypeOptions={processTypeOptions}
        isEdit={!!editingDeriveField}
        forceReset={forceReset}
      />
    </Modal>
  );
};

export default DeriveFieldModal;

