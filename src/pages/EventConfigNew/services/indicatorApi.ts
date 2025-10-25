/**
 * 指标API服务 - 完全按照原页面逻辑实现
 */

import { IndicatorItem } from '@/pages/IndicatorList/types';
import { ApiResponse, ResultPage } from '@/types';
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

  // 搜索指标（支持按编号和名称模糊搜索）
  searchIndicator: async (
    keyword: string = '',
    current: number = 1,
    pageSize: number = 20,
  ): Promise<ResultPage<IndicatorItem>> => {
    const response = await request('/api/indicators/search', {
      method: 'GET',
      params: { keyword, current, pageSize },
    });
    return response;
  },
};
