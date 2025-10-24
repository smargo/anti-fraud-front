/**
 * 指标API服务 - 完全按照原页面逻辑实现
 */

import { request } from '@umijs/max';

export interface IndicatorVO {
  id: number;
  indicatorNo: string;
  indicatorName: string;
  indicatorDesc?: string;
  indicatorField?: string;
  queryField?: string;
  queryNo?: string;
  createdDate: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface IndicatorItem {
  code: string;
  message: string;
  data: IndicatorVO;
}

export interface IndicatorQueryVO {
  indicatorNo?: string;
  indicatorName?: string;
  current?: number;
  pageSize?: number;
}

export const indicatorApi = {
  // 根据ID获取指标
  getById: async (id: number): Promise<IndicatorItem> => {
    const response = await request(`/api/indicators/${id}`, {
      method: 'GET',
    });
    return response;
  },

  // 根据指标编号获取指标
  getByIndicatorNo: async (indicatorNo: string): Promise<IndicatorItem> => {
    const response = await request(`/api/indicators/by-indicator-no/${indicatorNo}`, {
      method: 'GET',
    });
    return response;
  },

  // 分页查询指标
  list: async (
    params: IndicatorQueryVO,
  ): Promise<{
    records: IndicatorVO[];
    total: number;
    current: number;
    pageSize: number;
  }> => {
    const response = await request('/api/indicators/list', {
      method: 'GET',
      params,
    });
    return response;
  },

  // 创建指标
  create: async (indicator: Partial<IndicatorVO>) => {
    const response = await request('/api/indicators', {
      method: 'POST',
      data: indicator,
    });
    return response;
  },

  // 更新指标
  update: async (id: number, indicator: Partial<IndicatorVO>) => {
    const response = await request(`/api/indicators/${id}`, {
      method: 'PUT',
      data: indicator,
    });
    return response;
  },

  // 删除指标
  delete: async (id: number) => {
    const response = await request(`/api/indicators/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  // 搜索指标（支持按编号和名称模糊搜索）
  search: async (
    keyword: string = '',
    current: number = 1,
    pageSize: number = 20,
  ): Promise<{
    data: IndicatorVO[];
    total: number;
    success: boolean;
  }> => {
    const response = await request('/api/indicators/search', {
      method: 'GET',
      params: { keyword, current, pageSize },
    });
    return response;
  },
};
