/**
 * EventConfig 主页面容器
 */

import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs, Spin, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'umi';
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
import DeriveFieldConfigTab from './components/DeriveFieldConfigTab';
import StageConfigTab from './components/StageConfigTab';
import EventIndicatorConfigTab from './components/EventIndicatorConfigTab';
import StatementDependencyConfigTab from './components/StatementDependencyConfigTab';
import './index.less';

const EventConfig: React.FC = () => {
  const navigate = useNavigate();
  
  // 表格引用 - 用于刷新所有表格数据
  const fieldActionRef = useRef<any>();
  const deriveFieldActionRef = useRef<any>();
  const stageActionRef = useRef<any>();
  const eventIndicatorActionRef = useRef<any>();
  const statementDependencyActionRef = useRef<any>();
  
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

  // 刷新所有表格数据 - 与原页面一致
  const refreshAllTables = () => {
    fieldActionRef.current?.reload();
    deriveFieldActionRef.current?.reload();
    stageActionRef.current?.reload();
    eventIndicatorActionRef.current?.reload();
    statementDependencyActionRef.current?.reload();
  };

  const handleSelectVersion = (versionId: string) => {
    const selected = versionInfo.versionHistory.find(v => v.id === versionId) || null;
    updateCurrentVersion(selected);
    
    // 刷新所有表格数据 - 与原页面一致
    refreshAllTables();
    
    // 显示成功消息 - 与原页面一致
    if (selected) {
      message.success(`已切换到版本: ${selected.versionCode}`);
    }
  };

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
    <PageContainer 
      title={pageTitle}
      extra={[
        <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => navigate('/event-list')}>
          返回事件列表
        </Button>,
      ]}
    >
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
          onSelectVersion={handleSelectVersion}
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
                versionCode={currentVersion?.versionCode}
                isReadOnly={isReadOnly}
                fieldTypeOptions={fieldTypeOptions}
                actionRef={fieldActionRef}
              />
            </Tabs.TabPane>

            {/* 衍生字段 Tab */}
            <Tabs.TabPane tab={TAB_CONFIG.derive.label} key={TAB_CONFIG.derive.key}>
              <DeriveFieldConfigTab
                eventNo={eventNo}
                versionCode={currentVersion?.versionCode}
                isReadOnly={isReadOnly}
                fieldTypeOptions={fieldTypeOptions}
                deriveFieldProcessTypeOptions={deriveFieldProcessTypeOptions}
                actionRef={deriveFieldActionRef}
              />
            </Tabs.TabPane>

            {/* 阶段配置 Tab */}
            <Tabs.TabPane tab={TAB_CONFIG.stages.label} key={TAB_CONFIG.stages.key}>
              <StageConfigTab
                eventNo={eventNo}
                versionCode={currentVersion?.versionCode}
                isReadOnly={isReadOnly}
                eventStageOptions={eventStageOptions}
                stageBeanOptions={stageBeanOptions}
                actionRef={stageActionRef}
              />
            </Tabs.TabPane>

            {/* 事件指标 Tab */}
            <Tabs.TabPane tab={TAB_CONFIG.indicators.label} key={TAB_CONFIG.indicators.key}>
              <EventIndicatorConfigTab
                eventNo={eventNo}
                versionCode={currentVersion?.versionCode}
                isReadOnly={isReadOnly}
                actionRef={eventIndicatorActionRef}
              />
            </Tabs.TabPane>

            {/* 语句依赖 Tab */}
            <Tabs.TabPane tab={TAB_CONFIG.dependencies.label} key={TAB_CONFIG.dependencies.key}>
              <StatementDependencyConfigTab
                eventNo={eventNo}
                versionCode={currentVersion?.versionCode}
                isReadOnly={isReadOnly}
                actionRef={statementDependencyActionRef}
              />
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
