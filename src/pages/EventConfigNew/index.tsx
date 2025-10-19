/**
 * EventConfig 主页面容器
 */

import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs, Spin } from 'antd';
import { useEventConfig } from './hooks/useEventConfig';
import { useVersionControl } from './hooks/useVersionControl';
import { useDictData } from '@/hooks/useDictData';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import { DICT_CODE_LIST, TAB_CONFIG } from './constants';
import VersionControl from './components/VersionControl';
import VersionHistoryModal from './components/VersionControl/VersionHistoryModal';
import CreateVersionModal from './components/VersionControl/CreateVersionModal';
import CopyVersionModal from './components/VersionControl/CopyVersionModal';
import BasicInfoTab from './components/BasicInfoTab';
import FieldConfigTab from './components/FieldConfigTab';
import './index.less';

const EventConfig: React.FC = () => {
  // 使用字典数据管理Hook
  const { getDictOptions, loading: dictLoading } = useDictData(DICT_CODE_LIST);
  
  // 获取各种选项
  const fieldTypeOptions = getDictOptions('event_field_type_option');
  const deriveFieldProcessTypeOptions = getDictOptions('event_derive_field_process_type_option');
  const eventTypeOptions = getDictOptions('event_type_option');
  const eventStageOptions = getDictOptions('event_stage_option');
  const stageBeanOptions = getDictOptions('stage_bean_option');
  const versionStatusOptions = getDictOptions('version_status_option');
  const eventGroupOptions = getDictOptions('event_group_option');

  // 主配置Hook
  const {
    eventNo,
    eventDetail,
    currentVersion,
    isDraftMode,
    isReadOnly,
    configEventLoadProp,
    versionInfo,
    activeTab,
    loading,
    setActiveTab,
    loadEventDetail,
    loadVersionInfo,
    updateVersionInfo,
    updateCurrentVersion,
    pageTitle,
  } = useEventConfig();

  // 版本控制Hook
  const {
    versionHistoryVisible,
    createVersionModalVisible,
    copyVersionModalVisible,
    copyingVersion,
    versionHistoryActionRef,
    setVersionHistoryVisible,
    setCreateVersionModalVisible,
    setCopyVersionModalVisible,
    setCopyingVersion,
    refreshVersionHistory,
    handleCreateDraft,
    handleRollbackToVersion,
    handleCreateVersion,
    handleCopyVersion,
    showVersionHistory,
    showCreateVersionModal,
    showCopyVersionModal,
  } = useVersionControl(
    eventNo,
    versionInfo,
    updateVersionInfo,
    updateCurrentVersion
  );

  // 处理版本更新
  const handleVersionUpdate = () => {
    loadVersionInfo(eventNo);
  };

  // 处理创建版本成功
  const handleCreateVersionSuccess = () => {
    handleVersionUpdate();
  };

  // 处理复制版本成功
  const handleCopyVersionSuccess = () => {
    handleVersionUpdate();
  };

  if (loading || dictLoading) {
    return (
      <PageContainer title={false}>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={pageTitle}>
      <ErrorBoundary>
        <div className="eventConfig">
          {/* 版本控制组件 */}
          <VersionControl
            eventNo={eventNo}
            currentVersion={currentVersion}
            isDraftMode={isDraftMode}
            isReadOnly={isReadOnly}
            versionInfo={versionInfo}
            onCreateDraft={handleCreateDraft}
            onShowVersionHistory={showVersionHistory}
            onShowCreateVersionModal={showCreateVersionModal}
          />

          {/* Tab页面 */}
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            {/* 基础信息 Tab */}
            <Tabs.TabPane tab={TAB_CONFIG.basic.label} key={TAB_CONFIG.basic.key}>
              <BasicInfoTab
                eventDetail={eventDetail}
                currentVersion={currentVersion}
                isReadOnly={isReadOnly}
                configEventLoadProp={configEventLoadProp}
                eventTypeOptions={eventTypeOptions}
                eventGroupOptions={eventGroupOptions}
                onVersionUpdate={handleVersionUpdate}
              />
            </Tabs.TabPane>

            {/* 字段配置 Tab */}
            <Tabs.TabPane tab={TAB_CONFIG.fields.label} key={TAB_CONFIG.fields.key}>
              <FieldConfigTab
                eventNo={eventNo}
                versionId={currentVersion?.id}
                isReadOnly={isReadOnly}
                fieldTypeOptions={fieldTypeOptions}
              />
            </Tabs.TabPane>

            {/* 衍生字段 Tab */}
            <Tabs.TabPane tab={TAB_CONFIG.derive.label} key={TAB_CONFIG.derive.key}>
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <p>衍生字段配置 - 待实现</p>
              </div>
            </Tabs.TabPane>

            {/* 阶段配置 Tab */}
            <Tabs.TabPane tab={TAB_CONFIG.stages.label} key={TAB_CONFIG.stages.key}>
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <p>阶段配置 - 待实现</p>
              </div>
            </Tabs.TabPane>

            {/* 事件指标 Tab */}
            <Tabs.TabPane tab={TAB_CONFIG.indicators.label} key={TAB_CONFIG.indicators.key}>
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <p>事件指标配置 - 待实现</p>
              </div>
            </Tabs.TabPane>

            {/* 语句依赖 Tab */}
            <Tabs.TabPane tab={TAB_CONFIG.dependencies.label} key={TAB_CONFIG.dependencies.key}>
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <p>语句依赖配置 - 待实现</p>
              </div>
            </Tabs.TabPane>
          </Tabs>

          {/* 版本历史弹窗 */}
          <VersionHistoryModal
            visible={versionHistoryVisible}
            eventNo={eventNo}
            versionHistory={versionInfo.versionHistory}
            actionRef={versionHistoryActionRef}
            onCancel={() => setVersionHistoryVisible(false)}
            onCopyVersion={showCopyVersionModal}
          />

          {/* 创建版本弹窗 */}
          <CreateVersionModal
            visible={createVersionModalVisible}
            eventNo={eventNo}
            onCancel={() => setCreateVersionModalVisible(false)}
            onSuccess={handleCreateVersionSuccess}
          />

          {/* 复制版本弹窗 */}
          <CopyVersionModal
            visible={copyVersionModalVisible}
            eventNo={eventNo}
            sourceVersion={copyingVersion}
            onCancel={() => {
              setCopyVersionModalVisible(false);
              setCopyingVersion(null);
            }}
            onSuccess={handleCopyVersionSuccess}
          />
        </div>
      </ErrorBoundary>
    </PageContainer>
  );
};

export default EventConfig;
