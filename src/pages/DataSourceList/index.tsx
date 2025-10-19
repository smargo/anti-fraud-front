/**
 * DataSourceList 主页面组件
 */

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import { useDictData } from '@/hooks/useDictData';
import { DataSourceTable, DataSourceModal, DataSourceViewModal } from './components';
import { useDataSourceList } from './hooks/useDataSourceList';
import { handleDataSourceFormSubmit, handleDataSourceDelete } from './helper';
import { dataSourceApi } from '@/services/antifraud/datasource';
import './index.less';

const DataSourceList: React.FC = () => {
  // 使用字典数据管理Hook
  const { getDictOptions } = useDictData(['datasource_type_option']);
  
  // 获取数据源类型选项
  const dataSourceTypeOptions = getDictOptions('datasource_type_option');
  
  // 默认数据源列表状态
  const [defaultDatasources, setDefaultDatasources] = useState<string[]>([]);

  // 加载默认数据源列表
  useEffect(() => {
    const loadDefaultDatasources = async () => {
      try {
        const response = await dataSourceApi.getDefaultDatasources();
        setDefaultDatasources(response);
      } catch (error) {
        console.error('加载默认数据源列表失败:', error);
      }
    };
    loadDefaultDatasources();
  }, []);

  // 检查是否为受保护的默认数据源
  const isProtectedDataSource = (dataSourceNo: string) => {
    return defaultDatasources.includes(dataSourceNo);
  };

  const {
    modalVisible,
    editingDataSource,
    viewModalVisible,
    viewingDataSource,
    forceReset,
    actionRef,
    handleAdd,
    handleView,
    handleEdit,
    closeModal,
    closeViewModal,
    reloadTable,
  } = useDataSourceList();

  const handleFormSubmit = async (values: any) => {
    await handleDataSourceFormSubmit(values, editingDataSource, () => {
      reloadTable();
      closeModal();
    });
  };

  const handleDelete = (dataSourceNo: string) => {
    handleDataSourceDelete(dataSourceNo, () => {
      reloadTable();
    });
  };

  return (
    <PageContainer title={false}>
      <ErrorBoundary>
        <div className="dataSourceList">
          <DataSourceTable
            actionRef={actionRef}
            dataSourceTypeOptions={dataSourceTypeOptions}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isProtectedDataSource={isProtectedDataSource}
          />

          <DataSourceModal
            visible={modalVisible}
            editingDataSource={editingDataSource}
            forceReset={forceReset}
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
          />

          <DataSourceViewModal
            visible={viewModalVisible}
            viewingDataSource={viewingDataSource}
            dataSourceTypeOptions={dataSourceTypeOptions}
            onCancel={closeViewModal}
          />
        </div>
      </ErrorBoundary>
    </PageContainer>
  );
};

export default DataSourceList;