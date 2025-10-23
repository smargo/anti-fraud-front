import { request } from '@umijs/max';

// API响应格式
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// 版本控制相关接口
export interface EventConfigVersion {
  id: number;
  eventNo: string;
  versionCode: string;
  versionDesc: string;
  status: string;

  eventType: string;
  eventGroup: string;

  createdDate: string;
  createdBy: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
  approvedDate?: string;
  approvedBy?: string;
  activatedDate?: string;
  activatedBy?: string;
}

export interface CreateVersionRequest {
  eventNo: string;
  versionCode: string;
  versionDesc: string;
}

export interface EventConfigVersionInfo {
  currentPublishedVersion?: EventConfigVersion;
  workingDraftVersion?: EventConfigVersion;
  versionHistory: EventConfigVersion[];
  hasUnsavedChanges: boolean;
}

export interface ConfigChangeLog {
  id: string;
  versionId: string;
  changeType: 'ADD' | 'UPDATE' | 'DELETE' | 'CREATE' | 'ACTIVATE' | 'SUBMIT' | 'APPROVE' | 'REJECT';
  configType: 'VERSION' | 'FIELD' | 'DERIVE_FIELD' | 'STAGE' | 'INDICATOR';
  configId?: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  changeReason?: string;
  createdDate: string;
  createdBy: string;
}

// 版本管理 API
export const versionApi = {
  // 创建新版本
  createVersion: async (data: CreateVersionRequest): Promise<EventConfigVersion> => {
    const response: ApiResponse<EventConfigVersion> = await request('/api/event-config-version', {
      method: 'POST',
      data,
    });
    if (response.code === '0') {
      return response.data;
    } else {
      throw new Error(response.message || '创建版本失败');
    }
  },

  // 获取当前生效版本
  getCurrentVersion: async (eventNo: string): Promise<EventConfigVersion | null> => {
    const response: ApiResponse<EventConfigVersion> = await request(
      `/api/event-config-version/current/${eventNo}`,
    );
    if (response.code === '0') {
      return response.data;
    } else {
      throw new Error(response.message || '获取当前版本失败');
    }
  },

  // 获取版本历史
  getVersionHistory: async (eventNo: string): Promise<EventConfigVersion[]> => {
    const response: ApiResponse<EventConfigVersion[]> = await request(
      `/api/event-config-version/history/${eventNo}`,
    );
    if (response.code === '0') {
      return response.data;
    } else {
      throw new Error(response.message || '获取版本历史失败');
    }
  },

  // 分页查询版本历史（支持搜索）
  getVersionHistoryPage: async (
    eventNo: string,
    params: {
      versionCode?: string;
      versionDesc?: string;
      status?: string;
      current?: number;
      pageSize?: number;
    },
  ): Promise<{
    data: EventConfigVersion[];
    total: number;
    success: boolean;
  }> => {
    const response: {
      data: EventConfigVersion[];
      total: number;
      success: boolean;
    } = await request(`/api/event-config-version/history/${eventNo}/page`, {
      method: 'GET',
      params,
    });
    if (response.success) {
      return response;
    } else {
      throw new Error('获取版本历史失败');
    }
  },

  // 激活版本（原子操作）
  activateVersion: async (versionId: string): Promise<void> => {
    const response: ApiResponse<void> = await request(
      `/api/event-config-version/${versionId}/activate`,
      { method: 'POST' },
    );
    if (response.code !== '0') {
      throw new Error(response.message || '激活版本失败');
    }
  },

  // 复制版本
  copyVersion: async (versionId: string, newVersionCode: string): Promise<EventConfigVersion> => {
    const response: ApiResponse<EventConfigVersion> = await request(
      `/api/event-config-version/${versionId}/copy?newVersionCode=${encodeURIComponent(
        newVersionCode,
      )}`,
      { method: 'POST' },
    );
    if (response.code === '0') {
      return response.data;
    } else {
      throw new Error(response.message || '复制版本失败');
    }
  },

  // 版本回滚
  rollbackToVersion: async (versionId: string): Promise<void> => {
    const response: ApiResponse<void> = await request(
      `/api/event-config-version/${versionId}/rollback`,
      { method: 'POST' },
    );
    if (response.code !== '0') {
      throw new Error(response.message || '版本回滚失败');
    }
  },

  // 提交审批
  submitForApproval: async (versionId: string): Promise<void> => {
    const response: ApiResponse<void> = await request(
      `/api/event-config-version/${versionId}/submit`,
      { method: 'POST' },
    );
    if (response.code !== '0') {
      throw new Error(response.message || '提交审批失败');
    }
  },

  // 审批通过
  approveVersion: async (versionId: string, approver: string): Promise<void> => {
    const response: ApiResponse<void> = await request(
      `/api/event-config-version/${versionId}/approve?approver=${encodeURIComponent(approver)}`,
      { method: 'POST' },
    );
    if (response.code !== '0') {
      throw new Error(response.message || '审批通过失败');
    }
  },

  // 审批拒绝
  rejectVersion: async (versionId: string, reason: string): Promise<void> => {
    const response: ApiResponse<void> = await request(
      `/api/event-config-version/${versionId}/reject?reason=${encodeURIComponent(reason)}`,
      { method: 'POST' },
    );
    if (response.code !== '0') {
      throw new Error(response.message || '审批拒绝失败');
    }
  },

  // 获取变更日志
  getChangeLogs: async (versionId: string): Promise<ConfigChangeLog[]> => {
    const response: ApiResponse<ConfigChangeLog[]> = await request(
      `/api/event-config-version/${versionId}/change-logs`,
    );
    if (response.code === '0') {
      return response.data;
    } else {
      throw new Error(response.message || '获取变更日志失败');
    }
  },

  // 获取变更统计
  getChangeStatistics: async (versionId: string): Promise<any[]> => {
    const response: ApiResponse<any[]> = await request(
      `/api/event-config-version/${versionId}/change-statistics`,
    );
    if (response.code === '0') {
      return response.data;
    } else {
      throw new Error(response.message || '获取变更统计失败');
    }
  },

  // 版本对比
  compareVersions: async (versionId1: string, versionId2: string): Promise<any> => {
    const response: ApiResponse<any> = await request(
      `/api/event-config-version/compare?versionId1=${versionId1}&versionId2=${versionId2}`,
    );
    if (response.code === '0') {
      return response.data;
    } else {
      throw new Error(response.message || '版本对比失败');
    }
  },

  // 删除草稿版本
  deleteDraftVersion: async (versionId: string): Promise<boolean> => {
    const response: ApiResponse<boolean> = await request(`/api/event-config-version/${versionId}`, {
      method: 'DELETE',
    });
    if (response.code === '0') {
      return response.data;
    } else {
      throw new Error(response.message || '删除草稿版本失败');
    }
  },
};

// 版本信息相关函数
export const getVersionInfo = async (eventNo: string): Promise<EventConfigVersionInfo> => {
  try {
    console.log('getVersionInfo 开始，eventNo:', eventNo);

    const [currentVersion, versionHistory] = await Promise.all([
      versionApi.getCurrentVersion(eventNo).catch(() => null), // 如果获取当前版本失败，返回null
      versionApi.getVersionHistory(eventNo).catch(() => []), // 如果获取版本历史失败，返回空数组
    ]);

    console.log('getVersionInfo 获取到数据:', { currentVersion, versionHistory });

    // 根据状态判断版本类型
    const isDraft = currentVersion?.status === 'DRAFT';
    const isPublished =
      currentVersion?.status === 'ACTIVE' || currentVersion?.status === 'APPROVED';

    const result = {
      currentPublishedVersion: isPublished ? currentVersion : undefined,
      workingDraftVersion: isDraft ? currentVersion : undefined,
      versionHistory: versionHistory || [],
      hasUnsavedChanges: false,
    };

    console.log('getVersionInfo 返回结果:', result);
    return result;
  } catch (error) {
    console.error('获取版本信息失败:', error);
    return {
      currentPublishedVersion: undefined,
      workingDraftVersion: undefined,
      versionHistory: [],
      hasUnsavedChanges: false,
    };
  }
};

export const createDraft = async (
  eventNo: string,
  versionCode: string,
  versionDesc: string,
): Promise<EventConfigVersion> => {
  return versionApi.createVersion({
    eventNo,
    versionCode,
    versionDesc,
  });
};

export const discardDraft = async (draftId: string): Promise<boolean> => {
  return versionApi.deleteDraftVersion(draftId);
};

export const rollbackToVersion = async (
  versionId: string,
  eventNo: string,
): Promise<EventConfigVersion> => {
  await versionApi.rollbackToVersion(versionId);
  const version = await versionApi.getCurrentVersion(eventNo);
  if (!version) {
    throw new Error('回滚后无法获取当前版本');
  }
  return version;
};

export const saveDraft = async (draftId: string, configData: any): Promise<void> => {
  // 这里需要实现保存草稿配置的逻辑
  // 暂时只是模拟
  console.log('保存草稿配置:', draftId, configData);
};

// 更新版本信息
export const updateVersion = async (
  versionId: string,
  data: Partial<EventConfigVersion>,
): Promise<EventConfigVersion> => {
  const response: ApiResponse<EventConfigVersion> = await request(
    `/api/event-config-version/${versionId}`,
    {
      method: 'PUT',
      data,
    },
  );
  if (response.code === '0') {
    return response.data;
  } else {
    throw new Error(response.message || '更新版本失败');
  }
};
