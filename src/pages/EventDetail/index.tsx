/**
 * EventDetail 主页面组件
 */

import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { useParams } from 'react-router-dom';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import { EventDetailView } from './components';
import { useEventDetail } from './hooks/useEventDetail';
import './index.less';

const EventDetail: React.FC = () => {
  const { eventTransNo } = useParams<{ eventTransNo: string }>();
  const { eventDetail, loading } = useEventDetail(eventTransNo || '');

  return (
    <PageContainer>
      <ErrorBoundary>
        <EventDetailView eventDetail={eventDetail} loading={loading} />
      </ErrorBoundary>
    </PageContainer>
  );
};

export default EventDetail;