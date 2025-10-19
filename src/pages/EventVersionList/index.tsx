/**
 * EventVersionList 主页面组件
 */

import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import { useDictData } from '@/hooks/useDictData';
import { EventVersionTable, EventVersionViewModal } from './components';
import { useEventVersionList } from './hooks/useEventVersionList';
import './index.less';

const EventVersionList: React.FC = () => {
  // 使用字典数据管理Hook
  const { getDictOptions } = useDictData(['version_status_option', 'event_type_option', 'event_group_option']);
  
  // 获取各种选项
  const versionStatusOptions = getDictOptions('version_status_option');
  const eventTypeOptions = getDictOptions('event_type_option');
  const eventGroupOptions = getDictOptions('event_group_option');

  const {
    viewModalVisible,
    viewingVersion,
    actionRef,
    handleView,
    closeViewModal,
  } = useEventVersionList();

  return (
    <PageContainer title={false}>
      <ErrorBoundary>
        <div className="eventVersionList">
          <EventVersionTable
            actionRef={actionRef as React.RefObject<ActionType>}
            versionStatusOptions={versionStatusOptions}
            eventTypeOptions={eventTypeOptions}
            eventGroupOptions={eventGroupOptions}
            onView={handleView}
          />

          <EventVersionViewModal
            visible={viewModalVisible}
            viewingVersion={viewingVersion}
            versionStatusOptions={versionStatusOptions}
            eventTypeOptions={eventTypeOptions}
            eventGroupOptions={eventGroupOptions}
            onCancel={closeViewModal}
          />
        </div>
      </ErrorBoundary>
    </PageContainer>
  );
};

export default EventVersionList;