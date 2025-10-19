/**
 * StatementDependencyList 主页面组件
 */

import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import { StatementDependencyTable, StatementDependencyViewModal } from './components';
import { useStatementDependencyList } from './hooks/useStatementDependencyList';
import './index.less';

const StatementDependencyList: React.FC = () => {
  const {
    viewModalVisible,
    viewingStatementDependency,
    actionRef,
    handleView,
    closeViewModal,
    reloadTable,
  } = useStatementDependencyList();

  return (
    <PageContainer title={false}>
      <ErrorBoundary>
        <div className="statementDependencyList">
          <StatementDependencyTable
            actionRef={actionRef as React.RefObject<ActionType>}
            onView={handleView}
          />

          <StatementDependencyViewModal
            visible={viewModalVisible}
            viewingStatementDependency={viewingStatementDependency}
            onCancel={closeViewModal}
          />
        </div>
      </ErrorBoundary>
    </PageContainer>
  );
};

export default StatementDependencyList;