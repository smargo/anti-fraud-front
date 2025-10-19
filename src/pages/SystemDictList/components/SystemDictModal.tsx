/**
 * SystemDictModal 组件
 */

import React from 'react';
import { Modal } from 'antd';
import SystemDictForm from './SystemDictForm';
import type { SystemDictItem, SystemDictFormValues } from '../types';
import type { DictItem } from '@/utils/dictUtils';

interface SystemDictModalProps {
  visible: boolean;
  editingDict: SystemDictItem | undefined;
  forceReset: boolean;
  enableOptions: DictItem[];
  onSubmit: (values: SystemDictFormValues) => Promise<void>;
  onCancel: () => void;
}

const SystemDictModal: React.FC<SystemDictModalProps> = ({
  visible,
  editingDict,
  forceReset,
  enableOptions,
  onSubmit,
  onCancel,
}) => {
  return (
    <Modal
      title={editingDict ? '编辑字典' : '新增字典'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <SystemDictForm
        initialValues={editingDict}
        onSubmit={onSubmit}
        onCancel={onCancel}
        enableOptions={enableOptions}
        forceReset={forceReset}
      />
    </Modal>
  );
};

export default SystemDictModal;

