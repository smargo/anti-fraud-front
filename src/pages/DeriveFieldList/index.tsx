/**
 * DeriveFieldList 主页面组件
 */

import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import { useDictData } from '@/hooks/useDictData';
import { DeriveFieldTable, DeriveFieldViewModal } from './components';
import { useDeriveFieldList } from './hooks/useDeriveFieldList';
import './index.less';

const DeriveFieldList: React.FC = () => {
  // 使用字典数据管理Hook
  const { getDictOptions } = useDictData(['event_field_type_option']);
  
  // 获取字段类型选项
  const fieldTypeOptions = getDictOptions('event_field_type_option');

  const {
    viewModalVisible,
    viewingDeriveField,
    actionRef,
    handleView,
    closeViewModal,
  } = useDeriveFieldList();

  return (
    <PageContainer title={false}>
      <ErrorBoundary>
        <div className="deriveFieldList">
          <DeriveFieldTable
            actionRef={actionRef as React.RefObject<ActionType>}
            fieldTypeOptions={fieldTypeOptions}
            onView={handleView}
          />

          <DeriveFieldViewModal
            visible={viewModalVisible}
            viewingDeriveField={viewingDeriveField}
            fieldTypeOptions={fieldTypeOptions}
            onCancel={closeViewModal}
          />
        </div>
      </ErrorBoundary>
    </PageContainer>
  );
};

export default DeriveFieldList;