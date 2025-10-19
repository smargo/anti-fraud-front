import { request as umiRequest } from '@umijs/max';

// 通用服务相关类型定义
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: string | number;
}

export interface PaginationParams {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface PaginationResponse<T = any> {
  list: T[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

export interface UploadResponse {
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface ExportParams {
  format?: 'excel' | 'csv' | 'pdf';
  filename?: string;
  columns?: string[];
  filters?: Record<string, any>;
}

/**
 * 通用服务
 */
export class CommonService {
  // 通用请求方法
  static async request<T = any>(
    url: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: any;
      params?: any;
      headers?: Record<string, string>;
    } = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await umiRequest(url, {
        method: options.method || 'GET',
        data: options.data,
        params: options.params,
        headers: options.headers,
      });

      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null as T,
        message: error.message || '请求失败',
        code: error.code || 'REQUEST_ERROR',
      };
    }
  }

  // 分页请求
  static async requestWithPagination<T = any>(
    url: string,
    params: PaginationParams & Record<string, any> = {},
  ): Promise<PaginationResponse<T>> {
    try {
      const response = await umiRequest(url, {
        method: 'GET',
        params,
      });

      return {
        list: response.list || response.data || [],
        pagination: {
          current: response.pagination?.current || params.current || 1,
          pageSize: response.pagination?.pageSize || params.pageSize || 10,
          total: response.pagination?.total || response.total || 0,
        },
      };
    } catch (error) {
      console.error('分页请求失败', error);
      return {
        list: [],
        pagination: {
          current: params.current || 1,
          pageSize: params.pageSize || 10,
          total: 0,
        },
      };
    }
  }

  // 文件上传
  static async uploadFile(
    file: File,
    options: {
      category?: string;
      onProgress?: (percent: number) => void;
    } = {},
  ): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (options.category) {
        formData.append('category', options.category);
      }

      const response = await request('/api/common/upload', {
        method: 'POST',
        data: formData,
        onUploadProgress: options.onProgress
          ? (progressEvent: any) => {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              options.onProgress?.(percent);
            }
          : undefined,
      });

      return {
        url: response.url,
        name: response.name || file.name,
        size: response.size || file.size,
        type: response.type || file.type,
      };
    } catch (error) {
      console.error('文件上传失败', error);
      throw error;
    }
  }

  // 批量文件上传
  static async uploadFiles(
    files: File[],
    options: {
      category?: string;
      onProgress?: (percent: number) => void;
    } = {},
  ): Promise<UploadResponse[]> {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
      if (options.category) {
        formData.append('category', options.category);
      }

      const response = await request('/api/common/upload/batch', {
        method: 'POST',
        data: formData,
        onUploadProgress: options.onProgress
          ? (progressEvent: any) => {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              options.onProgress?.(percent);
            }
          : undefined,
      });

      return response || [];
    } catch (error) {
      console.error('批量文件上传失败', error);
      throw error;
    }
  }

  // 文件下载
  static async downloadFile(url: string, filename?: string): Promise<void> {
    try {
      const response = await umiRequest(url, {
        method: 'GET',
        responseType: 'blob',
      });

      const blob = new Blob([response]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('文件下载失败', error);
      throw error;
    }
  }

  // 数据导出
  static async exportData(url: string, params: ExportParams = {}): Promise<void> {
    try {
      const response = await umiRequest(url, {
        method: 'POST',
        data: params,
        responseType: 'blob',
      });

      const blob = new Blob([response]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = params.filename || `export.${params.format || 'excel'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('数据导出失败', error);
      throw error;
    }
  }

  // 数据导入
  static async importData(
    file: File,
    options: {
      type?: string;
      onProgress?: (percent: number) => void;
    } = {},
  ): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (options.type) {
        formData.append('type', options.type);
      }

      const response = await request('/api/common/import', {
        method: 'POST',
        data: formData,
        onUploadProgress: options.onProgress
          ? (progressEvent: any) => {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              options.onProgress?.(percent);
            }
          : undefined,
      });

      return {
        success: true,
        message: response.message || '导入成功',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || '导入失败',
      };
    }
  }

  // 批量操作
  static async batchOperation<T = any>(
    url: string,
    data: {
      ids: string[];
      operation: string;
      params?: any;
    },
  ): Promise<ApiResponse<T>> {
    try {
      const response = await umiRequest(url, {
        method: 'POST',
        data,
      });

      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null as T,
        message: error.message || '批量操作失败',
      };
    }
  }

  // 获取系统信息
  static async getSystemInfo(): Promise<{
    version: string;
    buildTime: string;
    environment: string;
    features: string[];
  }> {
    try {
      const response = await request('/api/common/system-info', {
        method: 'GET',
      });

      return {
        version: response.version || '1.0.0',
        buildTime: response.buildTime || '',
        environment: response.environment || 'development',
        features: response.features || [],
      };
    } catch (error) {
      console.error('获取系统信息失败', error);
      return {
        version: '1.0.0',
        buildTime: '',
        environment: 'development',
        features: [],
      };
    }
  }

  // 健康检查
  static async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    services: Array<{
      name: string;
      status: 'up' | 'down';
      responseTime?: number;
    }>;
  }> {
    try {
      const response = await request('/api/common/health', {
        method: 'GET',
      });

      return {
        status: response.status || 'healthy',
        timestamp: response.timestamp || new Date().toISOString(),
        services: response.services || [],
      };
    } catch (error) {
      console.error('健康检查失败', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        services: [],
      };
    }
  }

  // 获取配置信息
  static async getConfig(key?: string): Promise<any> {
    try {
      const url = key ? `/api/common/config/${key}` : '/api/common/config';
      const response = await umiRequest(url, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      console.error('获取配置信息失败', error);
      return null;
    }
  }

  // 更新配置信息
  static async updateConfig(key: string, value: any): Promise<void> {
    try {
      await umiRequest(`/api/common/config/${key}`, {
        method: 'PUT',
        data: { value },
      });
    } catch (error) {
      console.error('更新配置信息失败', error);
      throw error;
    }
  }

  // 发送通知
  static async sendNotification(data: {
    type: 'email' | 'sms' | 'push';
    recipients: string[];
    subject?: string;
    content: string;
    template?: string;
    params?: Record<string, any>;
  }): Promise<void> {
    try {
      await umiRequest('/api/common/notification', {
        method: 'POST',
        data,
      });
    } catch (error) {
      console.error('发送通知失败', error);
      throw error;
    }
  }

  // 获取日志
  static async getLogs(
    params: {
      level?: 'debug' | 'info' | 'warn' | 'error';
      startTime?: string;
      endTime?: string;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<
    Array<{
      timestamp: string;
      level: string;
      message: string;
      source?: string;
      metadata?: any;
    }>
  > {
    try {
      const response = await request('/api/common/logs', {
        method: 'GET',
        params,
      });

      return response || [];
    } catch (error) {
      console.error('获取日志失败', error);
      return [];
    }
  }
}

// 兼容性导出
export const request = CommonService.request;
export const requestWithPagination = CommonService.requestWithPagination;
export const uploadFile = CommonService.uploadFile;
export const uploadFiles = CommonService.uploadFiles;
export const downloadFile = CommonService.downloadFile;
export const exportData = CommonService.exportData;
export const importData = CommonService.importData;
export const batchOperation = CommonService.batchOperation;
export const getSystemInfo = CommonService.getSystemInfo;
export const healthCheck = CommonService.healthCheck;
export const getConfig = CommonService.getConfig;
export const updateConfig = CommonService.updateConfig;
export const sendNotification = CommonService.sendNotification;
export const getLogs = CommonService.getLogs;
