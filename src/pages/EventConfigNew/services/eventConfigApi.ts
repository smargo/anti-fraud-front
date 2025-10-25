/**
 * 事件配置API服务
 */

import {
  getVersionInfo as getVersionInfoFromApi,
  versionApi,
} from '@/services/antifraud/eventConfigVersion';
import { ApiResponse } from '@/types/index';
import { request } from 'umi';
import type { BasicInfoFormValues, EventConfigVersion, EventConfigVersionInfo } from '../types';
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
  try {
    return await getVersionInfoFromApi(eventNo);
  } catch (error) {
    console.error('获取版本信息失败:', error);
    return {
      versionHistory: [],
    };
  }
};

// 回滚到指定版本
export const rollbackToVersion = async (
  eventNo: string,
  versionId: string,
): Promise<ApiResponse> => {
  try {
    const response = await versionApi.rollbackToVersion(versionId);
    return response;
  } catch (error) {
    return {
      code: 'ERROR',
      message: error instanceof Error ? error.message : '回滚版本失败',
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
      versionCode: versionData.versionCode || '',
      versionDesc: versionData.versionDesc || '',
    });
    return version;
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
    return version;
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
