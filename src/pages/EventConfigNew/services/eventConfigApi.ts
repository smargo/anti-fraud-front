/**
 * 事件配置API服务
 */

import {
  getVersionInfo as getVersionInfoFromApi,
  versionApi,
} from '@/services/antifraud/eventConfigVersion';
import { request } from 'umi';
import type {
  ApiResponse,
  BasicInfoFormValues,
  EventConfigVersion,
  EventConfigVersionInfo,
  EventDetail,
} from '../types';

// 获取事件详情 - 完全按照原页面逻辑
export const getEventByEventNo = async (eventNo: string): Promise<EventDetail | null> => {
  try {
    const response = await request(`/api/events/eventNo/${eventNo}`, {
      method: 'GET',
    });
    return response.data; // 直接返回响应，与原页面一致
  } catch (error) {
    console.error('获取事件详情失败:', error);
    return null;
  }
};

// 获取版本信息
export const getVersionInfo = async (eventNo: string): Promise<EventConfigVersionInfo> => {
  try {
    return await getVersionInfoFromApi(eventNo);
  } catch (error) {
    console.error('获取版本信息失败:', error);
    return {
      versionHistory: [],
      hasUnsavedChanges: false,
    };
  }
};

// 创建草稿版本
export const createDraft = async (eventNo: string): Promise<ApiResponse<EventConfigVersion>> => {
  try {
    const versionCode = `v${Date.now()}`;
    const versionDesc = '草稿版本';
    const version = await versionApi.createVersion({
      eventNo,
      versionCode,
      versionDesc,
    });
    return {
      code: 'SUCCESS',
      message: '创建草稿版本成功',
      data: version,
    };
  } catch (error) {
    return {
      code: 'ERROR',
      message: error instanceof Error ? error.message : '创建草稿版本失败',
    };
  }
};

// 回滚到指定版本
export const rollbackToVersion = async (
  eventNo: string,
  versionId: string,
): Promise<ApiResponse> => {
  try {
    await versionApi.rollbackToVersion(versionId);
    return {
      code: 'SUCCESS',
      message: '回滚版本成功',
    };
  } catch (error) {
    return {
      code: 'ERROR',
      message: error instanceof Error ? error.message : '回滚版本失败',
    };
  }
};

// 保存草稿
export const saveDraft = async (
  eventNo: string,
  versionId: string,
  data: any,
): Promise<ApiResponse> => {
  try {
    const response: ApiResponse = await request(
      `/api/event-config-version/${versionId}/save-draft`,
      {
        method: 'POST',
        data: { eventNo, ...data },
      },
    );
    return response;
  } catch (error) {
    return {
      code: 'ERROR',
      message: error instanceof Error ? error.message : '保存草稿失败',
    };
  }
};

// 创建新版本
export const createVersion = async (
  eventNo: string,
  versionData: Partial<EventConfigVersion>,
): Promise<ApiResponse<EventConfigVersion>> => {
  try {
    const version = await versionApi.createVersion({
      eventNo,
      versionCode: versionData.versionCode || `v${Date.now()}`,
      versionDesc: versionData.versionDesc || '新版本',
    });
    return {
      code: 'SUCCESS',
      message: '创建版本成功',
      data: version,
    };
  } catch (error) {
    return {
      code: 'ERROR',
      message: error instanceof Error ? error.message : '创建版本失败',
    };
  }
};

// 复制版本
export const copyVersion = async (
  eventNo: string,
  sourceVersionId: string,
  versionData: Partial<EventConfigVersion>,
): Promise<ApiResponse<EventConfigVersion>> => {
  try {
    const version = await versionApi.copyVersion(
      sourceVersionId,
      versionData.versionCode || `v${Date.now()}`,
    );
    return {
      code: 'SUCCESS',
      message: '复制版本成功',
      data: version,
    };
  } catch (error) {
    return {
      code: 'ERROR',
      message: error instanceof Error ? error.message : '复制版本失败',
    };
  }
};

// 更新事件基础信息
export const updateEventBasicInfo = async (
  eventNo: string,
  values: BasicInfoFormValues,
): Promise<ApiResponse> => {
  try {
    const response: ApiResponse = await request(`/api/event/${eventNo}`, {
      method: 'PUT',
      data: values,
    });
    return response;
  } catch (error) {
    return {
      code: 'ERROR',
      message: error instanceof Error ? error.message : '更新事件基础信息失败',
    };
  }
};
