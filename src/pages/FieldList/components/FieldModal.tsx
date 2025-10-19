/**
 * FieldModal 组件
 */

import React from 'react';
import { Modal } from 'antd';
import FieldForm from './FieldForm';
import type { FieldItem, FieldFormValues } from '../types';

interface FieldModalProps {
  visible: boolean;
  editingField: FieldItem | null;
  fieldTypeOptions: any[];
  forceReset: boolean;
  onSubmit: (values: FieldFormValues) => Promise<void>;
  onCancel: () => void;
}

const FieldModal: React.FC<FieldModalProps> = ({
  visible,
  editingField,
  fieldTypeOptions,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  return (
    <Modal
      title={editingField ? '编辑字段' : '新增字段'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <FieldForm
        initialValues={editingField}
        onSubmit={onSubmit}
        onCancel={onCancel}
        fieldTypeOptions={fieldTypeOptions}
        isEdit={!!editingField}
        forceReset={forceReset}
      />
    </Modal>
  );
};

export default FieldModal;

