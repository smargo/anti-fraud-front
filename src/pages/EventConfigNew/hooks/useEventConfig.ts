/**
 * EventConfig 主Hook
 */

import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'umi';
import { getEventByEventNo, getVersionInfo } from '../services/eventConfigApi';
import type {
  EventConfigTabKey,
  EventConfigVersion,
  EventConfigVersionInfo,
  EventDetail,
  EventLoadProp,
} from '../types';
import { getPageTitle, selectBestVersion } from '../utils';

export const useEventConfig = () => {
  const location = useLocation();

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
  });

  // Tab状态
  const [activeTab, setActiveTab] = useState<EventConfigTabKey>('basic');

  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);

  // 从URL参数中获取eventNo
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventNoParam = params.get('eventNo');
    if (eventNoParam) {
      setEventNo(eventNoParam);
      loadEventDetail(eventNoParam);
      loadVersionInfo(eventNoParam);
    }
  }, [location.search]);

  // 加载事件详情 - 完全按照原页面逻辑
  const loadEventDetail = useCallback(async (eventNo: string) => {
    try {
      setLoading(true);
      const event = await getEventByEventNo(eventNo);
      if (event.code === '0') {
        setEventDetail(event.data);
      } else {
        message.error('加载事件详情失败');
        throw new Error(event.message || '加载事件详情失败');
      }
    } catch (error) {
      console.error('加载事件详情失败');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // 加载版本信息
  const loadVersionInfo = useCallback(async (eventNo: string) => {
    try {
      setLoading(true);
      const info = await getVersionInfo(eventNo);
      setVersionInfo(info);

      // 自动选择最佳版本
      const bestVersion = selectBestVersion(info.versionHistory);
      if (bestVersion) {
        setCurrentVersion(bestVersion);
        setIsDraftMode(bestVersion.status === 'DRAFT');
        setIsReadOnly(
          bestVersion.status === 'ACTIVE' ||
            bestVersion.status === 'APPROVED' ||
            bestVersion.status === 'ARCHIVED',
        );
      } else {
        setCurrentVersion(null);
        setIsDraftMode(false);
        setIsReadOnly(false);
      }

      setConfigEventLoadProp({
        eventNo: eventNo,
        specifyVersion: bestVersion,
      });
    } catch (error) {
      message.error('加载版本信息失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新版本信息
  const updateVersionInfo = useCallback((newVersionInfo: EventConfigVersionInfo) => {
    setVersionInfo(newVersionInfo);
  }, []);

  // 更新当前版本
  const updateCurrentVersion = useCallback((version: EventConfigVersion | null) => {
    setCurrentVersion(version);
    if (version) {
      setIsDraftMode(version.status === 'DRAFT');
      setIsReadOnly(
        version.status === 'ACTIVE' ||
          version.status === 'APPROVED' ||
          version.status === 'ARCHIVED',
      );
    } else {
      setIsDraftMode(false);
      setIsReadOnly(false);
    }

    setConfigEventLoadProp((prev) =>
      prev
        ? {
            ...prev,
            specifyVersion: version,
          }
        : null,
    );
  }, []);

  // 生成页面标题
  const pageTitle = getPageTitle(eventDetail, eventNo);

  return {
    // 状态
    eventNo,
    eventDetail,
    currentVersion,
    isDraftMode,
    isReadOnly,
    configEventLoadProp,
    versionInfo,
    activeTab,
    loading,

    // 方法
    setActiveTab,
    loadEventDetail,
    loadVersionInfo,
    updateVersionInfo,
    updateCurrentVersion,
    pageTitle,
  };
};
