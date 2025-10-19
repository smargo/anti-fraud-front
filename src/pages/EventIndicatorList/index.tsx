/**
 * EventIndicatorList 主页面组件
 */

import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import { EventIndicatorTable, EventIndicatorViewModal } from './components';
import { useEventIndicatorList } from './hooks/useEventIndicatorList';
import './index.less';

const EventIndicatorList: React.FC = () => {
  const {
    viewModalVisible,
    viewingEventIndicator,
    actionRef,
    handleView,
    closeViewModal,
    reloadTable,
  } = useEventIndicatorList();

  return (
    <PageContainer title={false}>
      <ErrorBoundary>
        <div className="eventIndicatorList">
          <EventIndicatorTable
            actionRef={actionRef as React.RefObject<ActionType>}
            onView={handleView}
          />

          <EventIndicatorViewModal
            visible={viewModalVisible}
            viewingEventIndicator={viewingEventIndicator}
            onCancel={closeViewModal}
          />
        </div>
      </ErrorBoundary>
    </PageContainer>
  );
};

export default EventIndicatorList;