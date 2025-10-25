/**
 * 数据源API服务 - 完全按照原页面逻辑实现
 */

import { request } from '@umijs/max';

export interface DataSourceVO {
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

export interface DataSourceItemResponse {
  data: DataSourceVO;
  code: string;
  message: string;
}

export const dataSourceApi = {
  // 根据数据源编号获取数据源
  getByDataSourceNo: async (dataSourceNo: string): Promise<DataSourceItemResponse> => {
    const response = await request(`/api/datasource/by-data-source-no/${dataSourceNo}`, {
      method: 'GET',
    });
    return response;
  },
};
