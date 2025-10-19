import { request } from '@umijs/max';

// 反欺诈业务相关类型定义
export interface EventConfig {
  id?: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  version?: string;
  createTime?: string;
  updateTime?: string;
}

export interface EventDetail {
  id?: string;
  eventId: string;
  fieldName: string;
  fieldType: string;
  fieldValue: any;
  createTime?: string;
}

export interface EventVersion {
  id?: string;
  eventId: string;
  version: string;
  config: any;
  status: 'DRAFT' | 'PUBLISHED';
  createTime?: string;
}

export interface DataSource {
  id?: string;
  name: string;
  type: string;
  connection: any;
  status: 'ACTIVE' | 'INACTIVE';
  createTime?: string;
}

export interface Field {
  id?: string;
  name: string;
  type: string;
  description?: string;
  isRequired: boolean;
  defaultValue?: any;
}

export interface Indicator {
  id?: string;
  name: string;
  formula: string;
  description?: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Stage {
  id?: string;
  name: string;
  order: number;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Statement {
  id?: string;
  name: string;
  content: string;
  type: 'RULE' | 'CONDITION';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface StatementDependency {
  id?: string;
  statementId: string;
  dependencyId: string;
  type: 'PREREQUISITE' | 'CONFLICT';
}

/**
 * 反欺诈业务服务
 */
export class AntiFraudService {
  // 事件配置相关
  static async getEventConfigs(params?: any) {
    return request('/api/antifraud/event-configs', {
      method: 'GET',
      params,
    });
  }

  static async getEventConfig(id: string) {
    return request(`/api/antifraud/event-configs/${id}`, {
      method: 'GET',
    });
  }

  static async createEventConfig(data: EventConfig) {
    return request('/api/antifraud/event-configs', {
      method: 'POST',
      data,
    });
  }

  static async updateEventConfig(id: string, data: EventConfig) {
    return request(`/api/antifraud/event-configs/${id}`, {
      method: 'PUT',
      data,
    });
  }

  static async deleteEventConfig(id: string) {
    return request(`/api/antifraud/event-configs/${id}`, {
      method: 'DELETE',
    });
  }

  // 事件详情相关
  static async getEventDetails(params?: any) {
    return request('/api/antifraud/event-details', {
      method: 'GET',
      params,
    });
  }

  static async getEventDetail(id: string) {
    return request(`/api/antifraud/event-details/${id}`, {
      method: 'GET',
    });
  }

  static async createEventDetail(data: EventDetail) {
    return request('/api/antifraud/event-details', {
      method: 'POST',
      data,
    });
  }

  static async updateEventDetail(id: string, data: EventDetail) {
    return request(`/api/antifraud/event-details/${id}`, {
      method: 'PUT',
      data,
    });
  }

  static async deleteEventDetail(id: string) {
    return request(`/api/antifraud/event-details/${id}`, {
      method: 'DELETE',
    });
  }

  // 事件版本相关
  static async getEventVersions(params?: any) {
    return request('/api/antifraud/event-versions', {
      method: 'GET',
      params,
    });
  }

  static async getEventVersion(id: string) {
    return request(`/api/antifraud/event-versions/${id}`, {
      method: 'GET',
    });
  }

  static async createEventVersion(data: EventVersion) {
    return request('/api/antifraud/event-versions', {
      method: 'POST',
      data,
    });
  }

  static async updateEventVersion(id: string, data: EventVersion) {
    return request(`/api/antifraud/event-versions/${id}`, {
      method: 'PUT',
      data,
    });
  }

  static async deleteEventVersion(id: string) {
    return request(`/api/antifraud/event-versions/${id}`, {
      method: 'DELETE',
    });
  }

  // 数据源相关
  static async getDataSources(params?: any) {
    return request('/api/antifraud/data-sources', {
      method: 'GET',
      params,
    });
  }

  static async getDataSource(id: string) {
    return request(`/api/antifraud/data-sources/${id}`, {
      method: 'GET',
    });
  }

  static async createDataSource(data: DataSource) {
    return request('/api/antifraud/data-sources', {
      method: 'POST',
      data,
    });
  }

  static async updateDataSource(id: string, data: DataSource) {
    return request(`/api/antifraud/data-sources/${id}`, {
      method: 'PUT',
      data,
    });
  }

  static async deleteDataSource(id: string) {
    return request(`/api/antifraud/data-sources/${id}`, {
      method: 'DELETE',
    });
  }

  // 字段相关
  static async getFields(params?: any) {
    return request('/api/antifraud/fields', {
      method: 'GET',
      params,
    });
  }

  static async getField(id: string) {
    return request(`/api/antifraud/fields/${id}`, {
      method: 'GET',
    });
  }

  static async createField(data: Field) {
    return request('/api/antifraud/fields', {
      method: 'POST',
      data,
    });
  }

  static async updateField(id: string, data: Field) {
    return request(`/api/antifraud/fields/${id}`, {
      method: 'PUT',
      data,
    });
  }

  static async deleteField(id: string) {
    return request(`/api/antifraud/fields/${id}`, {
      method: 'DELETE',
    });
  }

  // 指标相关
  static async getIndicators(params?: any) {
    return request('/api/antifraud/indicators', {
      method: 'GET',
      params,
    });
  }

  static async getIndicator(id: string) {
    return request(`/api/antifraud/indicators/${id}`, {
      method: 'GET',
    });
  }

  static async createIndicator(data: Indicator) {
    return request('/api/antifraud/indicators', {
      method: 'POST',
      data,
    });
  }

  static async updateIndicator(id: string, data: Indicator) {
    return request(`/api/antifraud/indicators/${id}`, {
      method: 'PUT',
      data,
    });
  }

  static async deleteIndicator(id: string) {
    return request(`/api/antifraud/indicators/${id}`, {
      method: 'DELETE',
    });
  }

  // 阶段相关
  static async getStages(params?: any) {
    return request('/api/antifraud/stages', {
      method: 'GET',
      params,
    });
  }

  static async getStage(id: string) {
    return request(`/api/antifraud/stages/${id}`, {
      method: 'GET',
    });
  }

  static async createStage(data: Stage) {
    return request('/api/antifraud/stages', {
      method: 'POST',
      data,
    });
  }

  static async updateStage(id: string, data: Stage) {
    return request(`/api/antifraud/stages/${id}`, {
      method: 'PUT',
      data,
    });
  }

  static async deleteStage(id: string) {
    return request(`/api/antifraud/stages/${id}`, {
      method: 'DELETE',
    });
  }

  // 语句相关
  static async getStatements(params?: any) {
    return request('/api/antifraud/statements', {
      method: 'GET',
      params,
    });
  }

  static async getStatement(id: string) {
    return request(`/api/antifraud/statements/${id}`, {
      method: 'GET',
    });
  }

  static async createStatement(data: Statement) {
    return request('/api/antifraud/statements', {
      method: 'POST',
      data,
    });
  }

  static async updateStatement(id: string, data: Statement) {
    return request(`/api/antifraud/statements/${id}`, {
      method: 'PUT',
      data,
    });
  }

  static async deleteStatement(id: string) {
    return request(`/api/antifraud/statements/${id}`, {
      method: 'DELETE',
    });
  }

  // 语句依赖相关
  static async getStatementDependencies(params?: any) {
    return request('/api/antifraud/statement-dependencies', {
      method: 'GET',
      params,
    });
  }

  static async getStatementDependency(id: string) {
    return request(`/api/antifraud/statement-dependencies/${id}`, {
      method: 'GET',
    });
  }

  static async createStatementDependency(data: StatementDependency) {
    return request('/api/antifraud/statement-dependencies', {
      method: 'POST',
      data,
    });
  }

  static async updateStatementDependency(id: string, data: StatementDependency) {
    return request(`/api/antifraud/statement-dependencies/${id}`, {
      method: 'PUT',
      data,
    });
  }

  static async deleteStatementDependency(id: string) {
    return request(`/api/antifraud/statement-dependencies/${id}`, {
      method: 'DELETE',
    });
  }

  // 批量操作
  static async batchCreateEventConfigs(data: EventConfig[]) {
    return request('/api/antifraud/event-configs/batch', {
      method: 'POST',
      data,
    });
  }

  static async batchUpdateEventConfigs(data: EventConfig[]) {
    return request('/api/antifraud/event-configs/batch', {
      method: 'PUT',
      data,
    });
  }

  static async batchDeleteEventConfigs(ids: string[]) {
    return request('/api/antifraud/event-configs/batch', {
      method: 'DELETE',
      data: { ids },
    });
  }

  // 导出功能
  static async exportEventConfigs(params?: any) {
    return request('/api/antifraud/event-configs/export', {
      method: 'GET',
      params,
      responseType: 'blob',
    });
  }

  static async exportEventDetails(params?: any) {
    return request('/api/antifraud/event-details/export', {
      method: 'GET',
      params,
      responseType: 'blob',
    });
  }

  // 导入功能
  static async importEventConfigs(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return request('/api/antifraud/event-configs/import', {
      method: 'POST',
      data: formData,
    });
  }
}

// 兼容性导出
export const getEventConfigs = AntiFraudService.getEventConfigs;
export const getEventConfig = AntiFraudService.getEventConfig;
export const createEventConfig = AntiFraudService.createEventConfig;
export const updateEventConfig = AntiFraudService.updateEventConfig;
export const deleteEventConfig = AntiFraudService.deleteEventConfig;

export const getEventDetails = AntiFraudService.getEventDetails;
export const getEventDetail = AntiFraudService.getEventDetail;
export const createEventDetail = AntiFraudService.createEventDetail;
export const updateEventDetail = AntiFraudService.updateEventDetail;
export const deleteEventDetail = AntiFraudService.deleteEventDetail;

export const getEventVersions = AntiFraudService.getEventVersions;
export const getEventVersion = AntiFraudService.getEventVersion;
export const createEventVersion = AntiFraudService.createEventVersion;
export const updateEventVersion = AntiFraudService.updateEventVersion;
export const deleteEventVersion = AntiFraudService.deleteEventVersion;

export const getDataSources = AntiFraudService.getDataSources;
export const getDataSource = AntiFraudService.getDataSource;
export const createDataSource = AntiFraudService.createDataSource;
export const updateDataSource = AntiFraudService.updateDataSource;
export const deleteDataSource = AntiFraudService.deleteDataSource;

export const getFields = AntiFraudService.getFields;
export const getField = AntiFraudService.getField;
export const createField = AntiFraudService.createField;
export const updateField = AntiFraudService.updateField;
export const deleteField = AntiFraudService.deleteField;

export const getIndicators = AntiFraudService.getIndicators;
export const getIndicator = AntiFraudService.getIndicator;
export const createIndicator = AntiFraudService.createIndicator;
export const updateIndicator = AntiFraudService.updateIndicator;
export const deleteIndicator = AntiFraudService.deleteIndicator;

export const getStages = AntiFraudService.getStages;
export const getStage = AntiFraudService.getStage;
export const createStage = AntiFraudService.createStage;
export const updateStage = AntiFraudService.updateStage;
export const deleteStage = AntiFraudService.deleteStage;

export const getStatements = AntiFraudService.getStatements;
export const getStatement = AntiFraudService.getStatement;
export const createStatement = AntiFraudService.createStatement;
export const updateStatement = AntiFraudService.updateStatement;
export const deleteStatement = AntiFraudService.deleteStatement;

export const getStatementDependencies = AntiFraudService.getStatementDependencies;
export const getStatementDependency = AntiFraudService.getStatementDependency;
export const createStatementDependency = AntiFraudService.createStatementDependency;
export const updateStatementDependency = AntiFraudService.updateStatementDependency;
export const deleteStatementDependency = AntiFraudService.deleteStatementDependency;
