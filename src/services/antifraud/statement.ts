import { StatementItem, StatementQueryVO } from '@/pages/StatementList/types';
import { ApiResponse, ResultPage } from '@/types/index';
import { request } from '@umijs/max';

export const statementApi = {
  // 根据ID获取语句
  getById: async (id: number): Promise<ApiResponse<StatementItem>> => {
    const response = await request(`/api/statements/${id}`, {
      method: 'GET',
    });
    return response;
  },

  // 根据语句编号获取语句
  getByStatementNo: async (statementNo: string): Promise<ApiResponse<StatementItem>> => {
    const response = await request(`/api/statements/by-statement-no/${statementNo}`, {
      method: 'GET',
    });
    return response;
  },

  // 分页查询语句
  statementPage: async (params: StatementQueryVO): Promise<ResultPage<StatementItem>> => {
    const response = await request('/api/statements/list', {
      method: 'GET',
      params,
    });
    return response;
  },

  // 创建语句
  createStatement: async (statement: Partial<StatementItem>) => {
    const response = await request('/api/statements', {
      method: 'POST',
      data: statement,
    });
    return response;
  },

  // 更新语句
  updateStatement: async (id: number, statement: Partial<StatementItem>) => {
    const response = await request(`/api/statements/${id}`, {
      method: 'PUT',
      data: statement,
    });
    return response;
  },

  // 删除语句
  deleteStatement: async (id: number): Promise<ApiResponse<boolean>> => {
    const response = await request(`/api/statements/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  // 搜索语句（支持按编号和描述模糊搜索）
  statementSearch: async (
    keyword: string = '',
    current: number = 1,
    pageSize: number = 20,
  ): Promise<ResultPage<StatementItem>> => {
    const response = await request('/api/statements/search', {
      method: 'GET',
      params: { keyword, current, pageSize },
    });
    return response;
  },
};
