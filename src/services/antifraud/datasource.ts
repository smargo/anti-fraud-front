import { DataSourceItem, DataSourceQueryVO } from '@/pages/DataSourceList/types';
import { ApiResponse, ResultPage } from '@/types';
import { request } from '@umijs/max';

export const dataSourceApi = {
  // 根据ID获取数据源
  getById: async (id: number): Promise<ApiResponse<DataSourceItem>> => {
    const response = await request(`/api/datasource/${id}`, {
      method: 'GET',
    });
    return response.data;
  },

  // 根据数据源编号获取数据源
  getByDataSourceNo: async (dataSourceNo: string): Promise<ApiResponse<DataSourceItem>> => {
    const response = await request(`/api/datasource/by-data-source-no/${dataSourceNo}`, {
      method: 'GET',
    });
    return response;
  },

  // 分页查询数据源
  dataSourcePage: async (params: DataSourceQueryVO): Promise<ResultPage<DataSourceItem>> => {
    const response = await request('/api/datasource/page', {
      method: 'GET',
      params,
    });
    return response;
  },

  // 获取所有数据源配置
  getAllConfigs: async (): Promise<ApiResponse<DataSourceItem[]>> => {
    const response = await request('/api/datasource/configs', {
      method: 'GET',
    });
    return response;
  },

  // 获取默认数据源编号列表
  getDefaultDatasources: async (): Promise<string[]> => {
    const response = await request('/api/datasource/default-datasources', {
      method: 'GET',
    });
    return response.data;
  },

  // 创建数据源
  createDataSource: async (dataSource: Partial<DataSourceItem>) => {
    const response = await request('/api/datasource/config', {
      method: 'POST',
      data: dataSource,
    });
    return response;
  },

  // 更新数据源
  updateDataSource: async (dataSourceNo: string, dataSource: Partial<DataSourceItem>) => {
    const response = await request(`/api/datasource/config/${dataSourceNo}`, {
      method: 'PUT',
      data: dataSource,
    });
    return response;
  },

  // 删除数据源
  deleteDataSource: async (dataSourceNo: string) => {
    const response = await request(`/api/datasource/config/${dataSourceNo}`, {
      method: 'DELETE',
    });
    return response;
  },

  // 搜索数据源（支持按编号和名称模糊搜索）
  searchDataSource: async (
    keyword: string = '',
    current: number = 1,
    pageSize: number = 20,
  ): Promise<ResultPage<DataSourceItem>> => {
    const response = await request('/api/datasource/search', {
      method: 'GET',
      params: { keyword, current, pageSize },
    });
    return response;
  },
};
