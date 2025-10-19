/**
 * StatementDependencyModal 组件
 */

import React from 'react';
import { Modal } from 'antd';
import StatementDependencyForm from './StatementDependencyForm';
import type { StatementDependencyItem, StatementDependencyFormValues } from '../types';

interface StatementDependencyModalProps {
  visible: boolean;
  editingStatementDependency: StatementDependencyItem | null;
  dependencyTypeOptions: any[];
  forceReset: boolean;
  onSubmit: (values: StatementDependencyFormValues) => Promise<void>;
  onCancel: () => void;
}

const StatementDependencyModal: React.FC<StatementDependencyModalProps> = ({
  visible,
  editingStatementDependency,
  dependencyTypeOptions,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  return (
    <Modal
      title={editingStatementDependency ? '编辑语句依赖' : '新增语句依赖'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <StatementDependencyForm
        initialValues={editingStatementDependency}
        onSubmit={onSubmit}
        onCancel={onCancel}
        dependencyTypeOptions={dependencyTypeOptions}
        isEdit={!!editingStatementDependency}
        forceReset={forceReset}
      />
    </Modal>
  );
};

export default StatementDependencyModal;

