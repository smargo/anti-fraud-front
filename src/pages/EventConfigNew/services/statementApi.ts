import { ApiResponse } from '@/pages/EventConfigNew/types';
import { request } from '@umijs/max';

export interface StatementVO {
  id: number;
  statementNo: string;
  statementDesc?: string;
  beanId?: string;
  dataSourceNo?: string;
  statementString?: string;
  statementParam?: string;
  resultList?: string;

  mongoOperationType?: string;
  mongoDatabase?: string;
  mongoCollection?: string;

  createdDate: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface StatementQueryVO {
  statementNo?: string;
  dataSourceNo?: string;
  keyword?: string;
  current?: number;
  pageSize?: number;
}

export const statementApi = {
  // 根据语句编号获取语句
  getByStatementNo: async (statementNo: string): Promise<ApiResponse<StatementVO>> => {
    const response = await request(`/api/statements/by-statement-no/${statementNo}`, {
      method: 'GET',
    });
    return response;
  },

  // 根据事件编号和版本代码获取语句列表
  getByEventNoAndVersionCode: async (
    eventNo: string,
    versionCode: string,
  ): Promise<ApiResponse<StatementVO[]>> => {
    const response = await request('/api/statements/by-event-no-and-version-code', {
      method: 'GET',
      params: { eventNo, versionCode },
    });
    return response;
  },
};
