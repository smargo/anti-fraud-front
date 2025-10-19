import { request } from '@umijs/max';

export interface StatementDO {
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
  // 根据ID获取语句
  getById: async (id: number): Promise<StatementDO> => {
    const response = await request(`/api/statements/${id}`, {
      method: 'GET',
    });
    return response;
  },

  // 根据语句编号获取语句
  getByStatementNo: async (statementNo: string): Promise<StatementDO> => {
    const response = await request(`/api/statements/by-statement-no/${statementNo}`, {
      method: 'GET',
    });
    return response;
  },

  // 分页查询语句
  list: async (
    params: StatementQueryVO,
  ): Promise<{
    records: StatementDO[];
    total: number;
    current: number;
    pageSize: number;
  }> => {
    const response = await request('/api/statements/list', {
      method: 'GET',
      params,
    });
    return response;
  },

  // 创建语句
  create: async (statement: Partial<StatementDO>) => {
    const response = await request('/api/statements', {
      method: 'POST',
      data: statement,
    });
    return response;
  },

  // 更新语句
  update: async (id: number, statement: Partial<StatementDO>) => {
    const response = await request(`/api/statements/${id}`, {
      method: 'PUT',
      data: statement,
    });
    return response;
  },

  // 删除语句
  delete: async (id: number) => {
    const response = await request(`/api/statements/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  // 根据事件编号和版本代码获取语句列表
  getByEventNoAndVersionCode: async (
    eventNo: string,
    versionCode: string,
  ): Promise<StatementDO[]> => {
    const response = await request('/api/statements/by-event-no-and-version-code', {
      method: 'GET',
      params: { eventNo, versionCode },
    });
    return response;
  },

  // 搜索语句（支持按编号和描述模糊搜索）
  search: async (
    keyword: string = '',
    current: number = 1,
    pageSize: number = 20,
  ): Promise<{
    data: StatementDO[];
    total: number;
    current: number;
    pageSize: number;
  }> => {
    const response = await request('/api/statements/search', {
      method: 'GET',
      params: { keyword, current, pageSize },
    });
    return response;
  },
};
