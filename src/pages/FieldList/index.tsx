/**
 * FieldList 主页面组件
 */

import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import { useDictData } from '@/hooks/useDictData';
import { FieldTable, FieldViewModal } from './components';
import { useFieldList } from './hooks/useFieldList';
import './index.less';

const FieldList: React.FC = () => {
  // 使用字典数据管理Hook
  const { getDictOptions } = useDictData(['event_field_type_option']);
  
  // 获取字段类型选项
  const fieldTypeOptions = getDictOptions('event_field_type_option');

  const {
    viewModalVisible,
    viewingField,
    actionRef,
    handleView,
    closeViewModal,
  } = useFieldList();

  return (
    <PageContainer title={false}>
      <ErrorBoundary>
        <div className="fieldList">
          <FieldTable
            actionRef={actionRef as React.RefObject<ActionType>}
            fieldTypeOptions={fieldTypeOptions}
            onView={handleView}
          />

          <FieldViewModal
            visible={viewModalVisible}
            viewingField={viewingField}
            fieldTypeOptions={fieldTypeOptions}
            onCancel={closeViewModal}
          />
        </div>
      </ErrorBoundary>
    </PageContainer>
  );
};

export default FieldList;