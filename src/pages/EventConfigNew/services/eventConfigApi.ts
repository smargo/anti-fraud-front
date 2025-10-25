/**
 * 事件配置API服务
 */

import {
  getVersionInfo as getVersionInfoFromApi,
  versionApi,
} from '@/services/antifraud/eventConfigVersion';
import { ApiResponse } from '@/types/index';
import { request } from 'umi';
import type { EventConfigVersion, EventConfigVersionInfo } from '../types';
import { EventDetailItem } from '../types';

// 获取事件详情 - 完全按照原页面逻辑
export const getEventByEventNo = async (eventNo: string): Promise<EventDetailItem> => {
  const response = await request(`/api/events/eventNo/${eventNo}`, {
    method: 'GET',
  });
  return response;
};

// 获取版本信息
export const getVersionInfo = async (eventNo: string): Promise<EventConfigVersionInfo> => {
  return await getVersionInfoFromApi(eventNo);
};

// 回滚到指定版本
export const rollbackToVersion = async (
  eventNo: string,
  versionId: string,
): Promise<ApiResponse<void>> => {
  const response = await versionApi.rollbackToVersion(versionId);
  return response;
};

// 创建新版本
export const createVersion = async (
  eventNo: string,
  versionData: Partial<EventConfigVersion>,
): Promise<ApiResponse<EventConfigVersion>> => {
  const version = await versionApi.createVersion({
    eventNo,
    versionCode: versionData.versionCode || '',
    versionDesc: versionData.versionDesc || '',
  });
  return version;
};

// 复制版本
export const copyVersion = async (
  eventNo: string,
  sourceVersionId: string,
  versionData: Partial<EventConfigVersion>,
): Promise<ApiResponse<EventConfigVersion>> => {
  const version = await versionApi.copyVersion(sourceVersionId, versionData.versionCode || '');
  return version;
};
