import { ResultPage } from '@/pages/EventConfigNew/types';
import { request } from '@umijs/max';

// API响应格式
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// 版本控制相关接口
export interface EventConfigVersion {
  id: string;
  eventNo: string;
  versionCode: string;
  versionDesc: string;
  status: 'DRAFT' | 'ACTIVE' | 'APPROVED' | 'ARCHIVED';

  eventType: string;
  eventGroup: string;

  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
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
  versionHistory: EventConfigVersion[];
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
  createVersion: async (data: CreateVersionRequest): Promise<ApiResponse<EventConfigVersion>> => {
    const response: ApiResponse<EventConfigVersion> = await request('/api/event-config-version', {
      method: 'POST',
      data,
    });
    if (response.code === '0') {
      return response;
    } else {
      throw new Error(response.message || '创建版本失败');
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
  ): Promise<ResultPage<EventConfigVersion>> => {
    const response: ResultPage<EventConfigVersion> = await request(
      `/api/event-config-version/history/${eventNo}/page`,
      {
        method: 'GET',
        params,
      },
    );
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
  copyVersion: async (
    versionId: string,
    newVersionCode: string,
  ): Promise<ApiResponse<EventConfigVersion>> => {
    const response: ApiResponse<EventConfigVersion> = await request(
      `/api/event-config-version/${versionId}/copy?newVersionCode=${encodeURIComponent(
        newVersionCode,
      )}`,
      { method: 'POST' },
    );
    if (response.code === '0') {
      return response;
    } else {
      throw new Error(response.message || '复制版本失败');
    }
  },

  // 版本回滚
  rollbackToVersion: async (versionId: string): Promise<ApiResponse<void>> => {
    const response: ApiResponse<void> = await request(
      `/api/event-config-version/${versionId}/rollback`,
      { method: 'POST' },
    );

    if (response.code !== '0') {
      throw new Error(response.message || '版本回滚失败');
    }
    return response;
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
  console.log('getVersionInfo 开始，eventNo:', eventNo);
  const versionHistory = await versionApi.getVersionHistory(eventNo);
  const result = {
    versionHistory: versionHistory || [],
  };

  console.log('getVersionInfo 返回结果:', result);
  return result;
};

export const discardDraft = async (draftId: string): Promise<boolean> => {
  return versionApi.deleteDraftVersion(draftId);
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
