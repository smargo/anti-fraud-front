import { request } from '@umijs/max';

export interface DataSourceDO {
  id: number;
  dataSourceNo: string;
  dataSourceName: string;
  dataSourceType: string;
  dataSourceConnectString: string;
  dataSourceUserName: string;
  dataSourcePassword: string;
  dataSourceParam: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

export interface DataSourceQueryVO {
  dataSourceNo?: string;
  dataSourceName?: string;
  dataSourceType?: string;
  keyword?: string;
  current?: number;
  pageSize?: number;
}

export const dataSourceApi = {
  // 根据ID获取数据源
  getById: async (id: number): Promise<DataSourceDO> => {
    const response = await request(`/api/datasource/${id}`, {
      method: 'GET',
    });
    return response;
  },

  // 根据数据源编号获取数据源
  getByDataSourceNo: async (dataSourceNo: string): Promise<DataSourceDO> => {
    const response = await request(`/api/datasource/by-data-source-no/${dataSourceNo}`, {
      method: 'GET',
    });
    return response;
  },

  // 分页查询数据源
  list: async (params: DataSourceQueryVO): Promise<{
    records: DataSourceDO[];
    total: number;
    current: number;
    pageSize: number;
  }> => {
    const response = await request('/api/datasource/page', {
      method: 'GET',
      params,
    });
    return response;
  },

  // 获取所有数据源配置
  getAllConfigs: async (): Promise<DataSourceDO[]> => {
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
    return response;
  },

  // 创建数据源
  create: async (dataSource: Partial<DataSourceDO>) => {
    const response = await request('/api/datasource/config', {
      method: 'POST',
      data: dataSource,
    });
    return response;
  },

  // 更新数据源
  update: async (dataSourceNo: string, dataSource: Partial<DataSourceDO>) => {
    const response = await request(`/api/datasource/config/${dataSourceNo}`, {
      method: 'PUT',
      data: dataSource,
    });
    return response;
  },

  // 删除数据源
  delete: async (dataSourceNo: string) => {
    const response = await request(`/api/datasource/config/${dataSourceNo}`, {
      method: 'DELETE',
    });
    return response;
  },

  // 测试数据源连接
  testConnection: async (dataSourceNo: string): Promise<{
    success: boolean;
    message: string;
    dataSourceType?: string;
  }> => {
    const response = await request(`/api/datasource/test/${dataSourceNo}`, {
      method: 'POST',
    });
    return response;
  },

  // 刷新数据源连接
  refresh: async (dataSourceNo: string): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await request(`/api/datasource/refresh/${dataSourceNo}`, {
      method: 'POST',
    });
    return response;
  },

  // 关闭数据源连接
  close: async (dataSourceNo: string): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await request(`/api/datasource/close/${dataSourceNo}`, {
      method: 'POST',
    });
    return response;
  },

  // 搜索数据源（支持按编号和名称模糊搜索）
  search: async (keyword: string = '', current: number = 1, pageSize: number = 20): Promise<{
    records: DataSourceDO[];
    total: number;
    current: number;
    pageSize: number;
  }> => {
    const response = await request('/api/datasource/search', {
      method: 'GET',
      params: { keyword, current, pageSize },
    });
    return response;
  },
};