import { IndicatorItem, IndicatorQueryVO } from '@/pages/IndicatorList/types';
import { ApiResponse } from '@/types';
import { request } from '@umijs/max';

export const indicatorApi = {
  // 根据ID获取指标
  getById: async (id: number): Promise<ApiResponse<IndicatorItem>> => {
    const response = await request(`/api/indicators/${id}`, {
      method: 'GET',
    });
    return response;
  },

  // 根据指标编号获取指标
  getByIndicatorNo: async (indicatorNo: string): Promise<ApiResponse<IndicatorItem>> => {
    const response = await request(`/api/indicators/by-indicator-no/${indicatorNo}`, {
      method: 'GET',
    });
    return response;
  },

  // 分页查询指标
  indicatorPage: async (
    params: IndicatorQueryVO,
  ): Promise<{
    records: IndicatorItem[];
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
  createIndicator: async (indicator: Partial<IndicatorItem>) => {
    const response = await request('/api/indicators', {
      method: 'POST',
      data: indicator,
    });
    return response;
  },

  // 更新指标
  updateIndicator: async (id: number, indicator: Partial<IndicatorItem>) => {
    const response = await request(`/api/indicators/${id}`, {
      method: 'PUT',
      data: indicator,
    });
    return response;
  },

  // 删除指标
  deleteIndicator: async (id: number) => {
    const response = await request(`/api/indicators/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};
