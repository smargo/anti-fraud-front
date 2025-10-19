/**
 * 版本控制Hook
 */

import { useState, useRef, useCallback } from 'react';
import { message } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { 
  createDraft, 
  rollbackToVersion, 
  createVersion, 
  copyVersion 
} from '../services/eventConfigApi';
import type { 
  EventConfigVersion, 
  EventConfigVersionInfo, 
  VersionControlState 
} from '../types';

export const useVersionControl = (
  eventNo: string,
  versionInfo: EventConfigVersionInfo,
  updateVersionInfo: (info: EventConfigVersionInfo) => void,
  updateCurrentVersion: (version: EventConfigVersion | null) => void
) => {
  // 版本控制状态
  const [versionHistoryVisible, setVersionHistoryVisible] = useState(false);
  const [createVersionModalVisible, setCreateVersionModalVisible] = useState(false);
  const [copyVersionModalVisible, setCopyVersionModalVisible] = useState(false);
  const [copyingVersion, setCopyingVersion] = useState<EventConfigVersion | null>(null);
  
  // 版本历史表格引用
  const versionHistoryActionRef = useRef<ActionType>(null);

  // 刷新版本历史表格
  const refreshVersionHistory = useCallback(() => {
    if (versionHistoryActionRef.current) {
      versionHistoryActionRef.current.reload();
    }
  }, []);

  // 创建草稿版本
  const handleCreateDraft = useCallback(async () => {
    try {
      const response = await createDraft(eventNo);
      if (response.code === 'SUCCESS') {
        message.success('创建草稿版本成功');
        // 重新加载版本信息
        // 这里需要调用父组件的loadVersionInfo方法
        refreshVersionHistory();
      } else {
        message.error(response.message || '创建草稿版本失败');
      }
    } catch (error) {
      message.error('创建草稿版本失败');
    }
  }, [eventNo, refreshVersionHistory]);

  // 回滚到指定版本
  const handleRollbackToVersion = useCallback(async (versionId: string) => {
    try {
      const response = await rollbackToVersion(eventNo, versionId);
      if (response.code === 'SUCCESS') {
        message.success('回滚版本成功');
        refreshVersionHistory();
      } else {
        message.error(response.message || '回滚版本失败');
      }
    } catch (error) {
      message.error('回滚版本失败');
    }
  }, [eventNo, refreshVersionHistory]);

  // 创建新版本
  const handleCreateVersion = useCallback(async (versionData: Partial<EventConfigVersion>) => {
    try {
      const response = await createVersion(eventNo, versionData);
      if (response.code === 'SUCCESS') {
        message.success('创建版本成功');
        setCreateVersionModalVisible(false);
        refreshVersionHistory();
      } else {
        message.error(response.message || '创建版本失败');
      }
    } catch (error) {
      message.error('创建版本失败');
    }
  }, [eventNo, refreshVersionHistory]);

  // 复制版本
  const handleCopyVersion = useCallback(async (versionData: Partial<EventConfigVersion>) => {
    if (!copyingVersion) return;
    
    try {
      const response = await copyVersion(eventNo, copyingVersion.id, versionData);
      if (response.code === 'SUCCESS') {
        message.success('复制版本成功');
        setCopyVersionModalVisible(false);
        setCopyingVersion(null);
        refreshVersionHistory();
      } else {
        message.error(response.message || '复制版本失败');
      }
    } catch (error) {
      message.error('复制版本失败');
    }
  }, [eventNo, copyingVersion, refreshVersionHistory]);

  // 显示版本历史
  const showVersionHistory = useCallback(() => {
    setVersionHistoryVisible(true);
  }, []);

  // 显示创建版本弹窗
  const showCreateVersionModal = useCallback(() => {
    setCreateVersionModalVisible(true);
  }, []);

  // 显示复制版本弹窗
  const showCopyVersionModal = useCallback((version: EventConfigVersion) => {
    setCopyingVersion(version);
    setCopyVersionModalVisible(true);
  }, []);

  return {
    // 状态
    versionHistoryVisible,
    createVersionModalVisible,
    copyVersionModalVisible,
    copyingVersion,
    versionHistoryActionRef,
    
    // 方法
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
  };
};
