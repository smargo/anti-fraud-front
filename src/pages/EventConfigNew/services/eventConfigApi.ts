/**
 * 事件配置API服务
 */

import { request } from '@umijs/max';
import type { EventDetail, EventConfigVersion, EventConfigVersionInfo, BasicInfoFormValues, ApiResponse } from '../types';

// 获取事件详情
export const getEventByEventNo = async (eventNo: string): Promise<EventDetail> => {
  const response = await request(`/api/event/${eventNo}`, {
    method: 'GET',
  });
  return response;
};

// 更新事件基础信息
export const updateEventBasicInfo = async (eventNo: string, values: BasicInfoFormValues): Promise<ApiResponse> => {
  const response = await request(`/api/event/${eventNo}`, {
    method: 'PUT',
    data: values,
  });
  return response;
};

// 获取版本信息
export const getVersionInfo = async (eventNo: string): Promise<EventConfigVersionInfo> => {
  const response = await request(`/api/event-config-version/${eventNo}`, {
    method: 'GET',
  });
  return response;
};

// 创建草稿版本
export const createDraft = async (eventNo: string): Promise<ApiResponse<EventConfigVersion>> => {
  const response = await request('/api/event-config-version/draft', {
    method: 'POST',
    data: { eventNo },
  });
  return response;
};

// 回滚到指定版本
export const rollbackToVersion = async (eventNo: string, versionId: string): Promise<ApiResponse> => {
  const response = await request(`/api/event-config-version/${versionId}/rollback`, {
    method: 'POST',
    data: { eventNo },
  });
  return response;
};

// 保存草稿
export const saveDraft = async (eventNo: string, versionId: string, data: any): Promise<ApiResponse> => {
  const response = await request(`/api/event-config-version/${versionId}/save-draft`, {
    method: 'POST',
    data: { eventNo, ...data },
  });
  return response;
};

// 创建新版本
export const createVersion = async (eventNo: string, versionData: Partial<EventConfigVersion>): Promise<ApiResponse<EventConfigVersion>> => {
  const response = await request('/api/event-config-version', {
    method: 'POST',
    data: { eventNo, ...versionData },
  });
  return response;
};

// 复制版本
export const copyVersion = async (eventNo: string, sourceVersionId: string, versionData: Partial<EventConfigVersion>): Promise<ApiResponse<EventConfigVersion>> => {
  const response = await request('/api/event-config-version/copy', {
    method: 'POST',
    data: { eventNo, sourceVersionId, ...versionData },
  });
  return response;
};
