/**
 * 版本控制Hook
 */

import type { ActionType } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { rollbackToVersion } from '../services/eventConfigApi';
import type { EventConfigVersion, EventConfigVersionInfo } from '../types';

export const useVersionControl = (
  eventNo: string,
  versionInfo: EventConfigVersionInfo,
  updateVersionInfo: (info: EventConfigVersionInfo) => void,
  updateCurrentVersion: (version: EventConfigVersion | null) => void,
  loadVersionInfo: (eventNo: string) => Promise<void>,
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

  // 回滚到指定版本
  const handleRollbackToVersion = useCallback(
    async (versionId: string) => {
      const versionToRollback = versionInfo.versionHistory.find((v) => v.id === versionId);
      if (!versionToRollback) return;

      Modal.confirm({
        title: '确认回滚',
        content: `确定要回滚到版本 ${versionToRollback.versionCode} 吗？这将激活该版本并停用当前生效版本。`,
        okText: '确认回滚',
        cancelText: '取消',
        okType: 'danger',
        onOk: async () => {
          try {
            const response = await rollbackToVersion(eventNo, versionId);
            if (response.code === 'SUCCESS') {
              message.success('版本回滚成功');
              // 重新加载版本信息（会自动刷新表格） - 与原页面一致
              await loadVersionInfo(eventNo);
            } else {
              message.error(response.message || '回滚版本失败');
            }
          } catch (error: any) {
            message.error(error?.message || '回滚失败');
          }
        },
      });
    },
    [eventNo, versionInfo.versionHistory, loadVersionInfo],
  );

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

  // 激活版本
  const handleActivateVersion = useCallback(
    async (versionId: string) => {
      try {
        const { versionApi } = await import('@/services/antifraud/eventConfigVersion');
        await versionApi.activateVersion(versionId);
        message.success('版本激活成功');
        // 重新加载版本信息（会自动刷新表格） - 与原页面一致
        await loadVersionInfo(eventNo);
      } catch (error) {
        message.error(error?.message || '激活版本失败');
      }
    },
    [loadVersionInfo, eventNo],
  );

  // 删除草稿版本
  const handleDeleteDraftVersion = useCallback(
    async (versionId: string) => {
      Modal.confirm({
        title: '确认删除',
        content: '确定要删除这个草稿版本吗？删除后无法恢复。',
        okText: '确认删除',
        cancelText: '取消',
        okType: 'danger',
        onOk: async () => {
          try {
            const { discardDraft } = await import('@/services/antifraud/eventConfigVersion');
            await discardDraft(versionId);
            message.success('草稿版本已删除');
            // 重新加载版本信息（会自动刷新表格） - 与原页面一致
            await loadVersionInfo(eventNo);
          } catch (error: any) {
            message.error(error?.message || '删除草稿版本失败');
          }
        },
      });
    },
    [loadVersionInfo, eventNo],
  );

  // 检查是否存在草稿版本
  const hasDraftVersion = useCallback(() => {
    return versionInfo.versionHistory.some((v) => v.status === 'DRAFT');
  }, [versionInfo.versionHistory]);

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
    handleRollbackToVersion,
    handleActivateVersion,
    handleDeleteDraftVersion,
    hasDraftVersion,
    showVersionHistory,
    showCreateVersionModal,
    showCopyVersionModal,
  };
};
