/**
 * StageList 主页面组件
 */

import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import { useDictData } from '@/hooks/useDictData';
import { StageTable, StageViewModal } from './components';
import { useStageList } from './hooks/useStageList';
import './index.less';

const StageList: React.FC = () => {
  // 使用字典数据管理Hook
  const { getDictOptions } = useDictData(['event_stage_option']);
  
  // 获取阶段选项
  const stageOptions = getDictOptions('event_stage_option');

  const {
    viewModalVisible,
    viewingStage,
    actionRef,
    handleView,
    closeViewModal,
  } = useStageList();

  return (
    <PageContainer title={false}>
      <ErrorBoundary>
        <div className="stageList">
          <StageTable
            actionRef={actionRef as React.RefObject<ActionType>}
            stageOptions={stageOptions}
            onView={handleView}
          />

          <StageViewModal
            visible={viewModalVisible}
            viewingStage={viewingStage}
            stageOptions={stageOptions}
            onCancel={closeViewModal}
          />
        </div>
      </ErrorBoundary>
    </PageContainer>
  );
};

export default StageList;