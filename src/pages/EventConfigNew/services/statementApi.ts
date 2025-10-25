import { StatementItem } from '@/pages/StatementList/types';
import { ApiResponse } from '@/types/index';
import { request } from '@umijs/max';

export const statementApi = {
  // 根据语句编号获取语句
  getByStatementNo: async (statementNo: string): Promise<ApiResponse<StatementItem>> => {
    const response = await request(`/api/statements/by-statement-no/${statementNo}`, {
      method: 'GET',
    });
    return response;
  },

  // 根据事件编号和版本代码获取语句列表
  getByEventNoAndVersionCode: async (
    eventNo: string,
    versionCode: string,
  ): Promise<ApiResponse<StatementItem[]>> => {
    const response = await request('/api/statements/by-event-no-and-version-code', {
      method: 'GET',
      params: { eventNo, versionCode },
    });
    return response;
  },
};
