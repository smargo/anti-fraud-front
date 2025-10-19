/**
 * EventConfig 主页面组件
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Card, Tabs, Button, Space, Form, message, Input, Select, Popconfirm, Modal, Row, Col, Switch, Tooltip, Tag, Typography, Descriptions } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined, SaveOutlined, ArrowLeftOutlined, HistoryOutlined, SendOutlined, FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useLocation, useNavigate } from 'umi';
import { useDictData } from '@/hooks/useDictData';
import { convertDictToValueEnum, getDictText } from '@/utils/dictUtils';
import ErrorBoundary from '@/components/Common/ErrorBoundary';
import { VersionControl, BasicInfoTab } from './components';
import { DICT_CODE_LIST } from './constants';
import { selectBestVersion, hasDraftVersion } from './helper';
import type { EventLoadProp, EventConfigVersion, EventConfigVersionInfo, EventDetail } from './types';
import './index.less';

const EventConfig: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 使用字典数据管理Hook
  const { getDictOptions, loading } = useDictData(DICT_CODE_LIST);
  
  // 获取各种选项
  const fieldTypeOptions = getDictOptions('event_field_type_option');
  const deriveFieldProcessTypeOptions = getDictOptions('event_derive_field_process_type_option');
  const eventTypeOptions = getDictOptions('event_type_option');
  const eventStageOptions = getDictOptions('event_stage_option');
  const stageBeanOptions = getDictOptions('stage_bean_option');
  const versionStatusOptions = getDictOptions('version_status_option');
  const eventGroupOptions = getDictOptions('event_group_option');

  // 基础状态
  const [eventNo, setEventNo] = useState<string>('');
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [currentVersion, setCurrentVersion] = useState<EventConfigVersion | null>(null);
  const [isDraftMode, setIsDraftMode] = useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const [configEventLoadProp, setConfigEventLoadProp] = useState<EventLoadProp | null>(null);

  // 版本相关状态
  const [versionInfo, setVersionInfo] = useState<EventConfigVersionInfo>({
    versionHistory: [],
    hasUnsavedChanges: false,
  });
  const [versionHistoryVisible, setVersionHistoryVisible] = useState(false);

  // 表单引用
  const [eventForm] = Form.useForm();

  // 版本历史表格引用
  const versionHistoryActionRef = useRef<ActionType>();

  // 刷新版本历史表格的辅助方法
  const refreshVersionHistory = useCallback(() => {
    versionHistoryActionRef.current?.reload();
  }, []);

  // 加载事件详情
  const loadEventDetail = useCallback(async (eventNo: string) => {
    try {
      // 这里应该调用实际的API
      // const response = await getEventByEventNo(eventNo);
      // setEventDetail(response.data);
      
      // 模拟数据
      setEventDetail({
        id: '1',
        eventNo: eventNo,
        eventName: `事件${eventNo}`,
        eventType: 'FRAUD',
        eventGroup: 'GROUP1',
        eventDesc: '这是一个测试事件',
        createdDate: '2023-01-01T00:00:00Z',
        lastModifiedDate: '2023-01-01T00:00:00Z',
      });
    } catch (error) {
      console.error('加载事件详情失败:', error);
    }
  }, []);

  // 加载版本信息
  const loadVersionInfo = useCallback(async (eventNo: string) => {
    try {
      // 这里应该调用实际的API
      // const info = await getVersionInfo(eventNo);
      
      // 模拟数据
      const mockInfo: EventConfigVersionInfo = {
        versionHistory: [
          {
            id: 1,
            versionCode: 'v1.0.0',
            versionDesc: '初始版本',
            status: 'ACTIVE',
            createdDate: '2023-01-01T00:00:00Z',
            createdBy: 'admin',
          },
          {
            id: 2,
            versionCode: 'v1.1.0',
            versionDesc: '功能更新版本',
            status: 'DRAFT',
            createdDate: '2023-01-02T00:00:00Z',
            createdBy: 'admin',
          },
        ],
        hasUnsavedChanges: false,
      };
      
      setVersionInfo(mockInfo);
      
      // 自动选择最佳版本
      const bestVersion = selectBestVersion(mockInfo.versionHistory);
      if (bestVersion) {
        setCurrentVersion(bestVersion);
        setIsDraftMode(bestVersion.status === 'DRAFT');
        setIsReadOnly(
          bestVersion.status === 'ACTIVE' ||
            bestVersion.status === 'APPROVED' ||
            bestVersion.status === 'ARCHIVED',
        );
        
        setConfigEventLoadProp({
          eventNo: eventNo,
          specifyVersion: bestVersion,
        });
      }
    } catch (error) {
      console.error('加载版本信息失败:', error);
    }
  }, []);

  // 初始化
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const eventNoParam = urlParams.get('eventNo');
    
    if (eventNoParam) {
      setEventNo(eventNoParam);
      loadEventDetail(eventNoParam);
      loadVersionInfo(eventNoParam);
    }
  }, [location.search, loadEventDetail, loadVersionInfo]);

  // 版本控制相关方法
  const handleCreateVersion = () => {
    // 实现创建版本逻辑
    message.info('创建版本功能待实现');
  };

  const handleActivateVersion = async (versionId: number) => {
    // 实现激活版本逻辑
    message.info('激活版本功能待实现');
  };

  const handleShowVersionHistory = () => {
    setVersionHistoryVisible(true);
  };

  const handleVersionSelect = async (versionId: number) => {
    try {
      const selectedVersion = versionInfo.versionHistory.find(
        (v: EventConfigVersion) => v.id === versionId,
      );
      if (selectedVersion) {
        setCurrentVersion(selectedVersion);
        setIsDraftMode(selectedVersion.status === 'DRAFT');
        setIsReadOnly(
          selectedVersion.status === 'ACTIVE' ||
            selectedVersion.status === 'APPROVED' ||
            selectedVersion.status === 'ARCHIVED',
        );
        setConfigEventLoadProp({
          eventNo: eventNo,
          specifyVersion: selectedVersion,
        });
      }
    } catch (error) {
      console.error('选择版本失败:', error);
    }
  };

  const handleBasicInfoSubmit = async (values: any) => {
    try {
      // 实现保存基础信息逻辑
      message.success('基础信息保存成功');
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 无版本提示组件
  const NoVersionDisplay = () => {
    return (
      <div
        style={{
          marginBottom: 16,
          padding: 24,
          background: '#fafafa',
          borderRadius: 4,
          textAlign: 'center',
          border: '1px dashed #d9d9d9',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 16, color: '#666' }}>该事件暂无配置版本</span>
        </div>
        <div style={{ color: '#999' }}>请先创建版本，然后开始配置事件信息</div>
      </div>
    );
  };

  // 版本信息显示组件
  const VersionInfoDisplay = () => {
    if (currentVersion) return null;
    return (
      <div
        style={{
          marginBottom: 16,
          padding: 24,
          background: '#fafafa',
          borderRadius: 4,
          textAlign: 'center',
          border: '1px dashed #d9d9d9',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 16, color: '#666' }}>请先选择一个版本进行编辑</span>
        </div>
        <div style={{ color: '#999' }}>在版本控制面板中选择要编辑的版本</div>
      </div>
    );
  };

  return (
    <PageContainer
      title={false}
      extra={[
        <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => navigate('/event/list')}>
          返回列表
        </Button>,
      ]}
    >
      <ErrorBoundary>
        <div className="eventConfig">
          {/* 版本控制组件 */}
          <VersionControl
            versionInfo={versionInfo}
            currentVersion={currentVersion}
            versionStatusOptions={versionStatusOptions}
            isDraftMode={isDraftMode}
            isReadOnly={isReadOnly}
            onCreateVersion={handleCreateVersion}
            onActivateVersion={handleActivateVersion}
            onShowVersionHistory={handleShowVersionHistory}
            onVersionSelect={handleVersionSelect}
            hasDraftVersion={() => hasDraftVersion(versionInfo.versionHistory)}
          />

          {/* 主要内容区域 */}
          <Card>
            <Tabs defaultActiveKey="basic">
              <Tabs.TabPane tab="基础信息" key="basic">
                {!configEventLoadProp ||
                !configEventLoadProp.specifyVersion ||
                !configEventLoadProp.specifyVersion.id ||
                !configEventLoadProp.specifyVersion.versionCode ? (
                  <NoVersionDisplay />
                ) : (
                  <>
                    <VersionInfoDisplay />
                    <BasicInfoTab
                      eventDetail={eventDetail}
                      currentVersion={currentVersion}
                      eventTypeOptions={eventTypeOptions}
                      eventGroupOptions={eventGroupOptions}
                      isReadOnly={isReadOnly}
                      onSubmit={handleBasicInfoSubmit}
                    />
                  </>
                )}
              </Tabs.TabPane>
              
              {/* 其他标签页可以在这里添加 */}
              <Tabs.TabPane tab="字段配置" key="fields">
                <div>字段配置功能待实现</div>
              </Tabs.TabPane>
              
              <Tabs.TabPane tab="衍生字段" key="derive">
                <div>衍生字段功能待实现</div>
              </Tabs.TabPane>
              
              <Tabs.TabPane tab="阶段配置" key="stages">
                <div>阶段配置功能待实现</div>
              </Tabs.TabPane>
              
              <Tabs.TabPane tab="事件指标" key="indicators">
                <div>事件指标功能待实现</div>
              </Tabs.TabPane>
              
              <Tabs.TabPane tab="语句依赖" key="dependencies">
                <div>语句依赖功能待实现</div>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </div>
      </ErrorBoundary>
    </PageContainer>
  );
};

export default EventConfig;