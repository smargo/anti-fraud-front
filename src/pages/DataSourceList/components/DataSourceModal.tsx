/**
 * DataSourceModal 组件
 */

import React from 'react';
import { Modal } from 'antd';
import DataSourceForm from './DataSourceForm';
import type { DataSourceItem, DataSourceFormValues } from '../types';

interface DataSourceModalProps {
  visible: boolean;
  editingDataSource: DataSourceItem | null;
  forceReset: boolean;
  onSubmit: (values: DataSourceFormValues) => Promise<void>;
  onCancel: () => void;
}

const DataSourceModal: React.FC<DataSourceModalProps> = ({
  visible,
  editingDataSource,
  forceReset,
  onSubmit,
  onCancel,
}) => {
  return (
    <Modal
      title={editingDataSource ? '编辑数据源' : '新增数据源'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <DataSourceForm
        initialValues={editingDataSource}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isEdit={!!editingDataSource}
        forceReset={forceReset}
      />
    </Modal>
  );
};

export default DataSourceModal;

