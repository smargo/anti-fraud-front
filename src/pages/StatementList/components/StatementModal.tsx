/**
 * StatementModal 组件
 */

import React from 'react';
import { Modal } from 'antd';
import StatementForm from './StatementForm';
import type { StatementItem, StatementFormValues } from '../types';

interface StatementModalProps {
  visible: boolean;
  editingStatement: StatementItem | null;
  mongoOperateOptions: any[];
  loading?: boolean;
  forceReset: boolean;
  onSubmit: (values: StatementFormValues) => Promise<void>;
  onCancel: () => void;
}

const StatementModal: React.FC<StatementModalProps> = ({
  visible,
  editingStatement,
  mongoOperateOptions,
  loading,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  return (
    <Modal
      title={editingStatement ? '编辑语句' : '新增语句'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <StatementForm
        initialValues={editingStatement}
        onSubmit={onSubmit}
        onCancel={onCancel}
        mongoOperateOptions={mongoOperateOptions}
        loading={loading}
        forceReset={forceReset}
      />
    </Modal>
  );
};

export default StatementModal;

