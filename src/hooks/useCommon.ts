import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import { CommonService } from '@/services/common';
import type {
  ApiResponse,
  PaginationParams,
  PaginationResponse,
  UploadResponse,
} from '@/services/common';

/**
 * 通用请求 Hook
 */
export const useRequest = <T = any>() => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const request = useCallback(
    async (
      url: string,
      options: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        data?: any;
        params?: any;
        headers?: Record<string, string>;
      } = {},
    ): Promise<ApiResponse<T>> => {
      setLoading(true);
      setError(null);

      try {
        const response = await CommonService.request<T>(url, options);
        setData(response.data);
        return response;
      } catch (err) {
        const error = err as Error;
        setError(error);
        return {
          success: false,
          data: null as T,
          message: error.message || '请求失败',
          code: 'REQUEST_ERROR',
        };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    data,
    error,
    request,
  };
};

/**
 * 分页请求 Hook
 */
export const usePaginationRequest = <T = any>() => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PaginationResponse<T>>({
    list: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });
  const [error, setError] = useState<Error | null>(null);

  const request = useCallback(
    async (
      url: string,
      params: PaginationParams & Record<string, any> = {},
    ): Promise<PaginationResponse<T>> => {
      setLoading(true);
      setError(null);

      try {
        const response = await CommonService.requestWithPagination<T>(url, params);
        setData(response);
        return response;
      } catch (err) {
        const error = err as Error;
        setError(error);
        return {
          list: [],
          pagination: {
            current: params.current || 1,
            pageSize: params.pageSize || 10,
            total: 0,
          },
        };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    data,
    error,
    request,
  };
};

/**
 * 文件上传 Hook
 */
export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadResponse[]>([]);

  const uploadFile = useCallback(
    async (
      file: File,
      options: {
        category?: string;
        onProgress?: (percent: number) => void;
      } = {},
    ): Promise<UploadResponse> => {
      setUploading(true);
      setUploadProgress(0);

      try {
        const response = await CommonService.uploadFile(file, {
          ...options,
          onProgress: (percent) => {
            setUploadProgress(percent);
            options.onProgress?.(percent);
          },
        });

        setUploadedFiles((prev) => [...prev, response]);
        message.success('文件上传成功');
        return response;
      } catch (error) {
        message.error('文件上传失败');
        console.error('文件上传失败:', error);
        throw error;
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [],
  );

  const uploadFiles = useCallback(
    async (
      files: File[],
      options: {
        category?: string;
        onProgress?: (percent: number) => void;
      } = {},
    ): Promise<UploadResponse[]> => {
      setUploading(true);
      setUploadProgress(0);

      try {
        const response = await CommonService.uploadFiles(files, {
          ...options,
          onProgress: (percent) => {
            setUploadProgress(percent);
            options.onProgress?.(percent);
          },
        });

        setUploadedFiles((prev) => [...prev, ...response]);
        message.success(`成功上传 ${files.length} 个文件`);
        return response;
      } catch (error) {
        message.error('批量文件上传失败');
        console.error('批量文件上传失败:', error);
        throw error;
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [],
  );

  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  return {
    uploading,
    uploadProgress,
    uploadedFiles,
    uploadFile,
    uploadFiles,
    clearUploadedFiles,
  };
};

/**
 * 文件下载 Hook
 */
export const useDownload = () => {
  const [downloading, setDownloading] = useState(false);

  const downloadFile = useCallback(async (url: string, filename?: string) => {
    setDownloading(true);
    try {
      await CommonService.downloadFile(url, filename);
      message.success('文件下载成功');
    } catch (error) {
      message.error('文件下载失败');
      console.error('文件下载失败:', error);
      throw error;
    } finally {
      setDownloading(false);
    }
  }, []);

  return {
    downloading,
    downloadFile,
  };
};

/**
 * 数据导出 Hook
 */
export const useExport = () => {
  const [exporting, setExporting] = useState(false);

  const exportData = useCallback(
    async (
      url: string,
      params: {
        format?: 'excel' | 'csv' | 'pdf';
        filename?: string;
        columns?: string[];
        filters?: Record<string, any>;
      } = {},
    ) => {
      setExporting(true);
      try {
        await CommonService.exportData(url, params);
        message.success('数据导出成功');
      } catch (error) {
        message.error('数据导出失败');
        console.error('数据导出失败:', error);
        throw error;
      } finally {
        setExporting(false);
      }
    },
    [],
  );

  return {
    exporting,
    exportData,
  };
};

/**
 * 数据导入 Hook
 */
export const useImport = () => {
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const importData = useCallback(
    async (
      file: File,
      options: {
        type?: string;
        onProgress?: (percent: number) => void;
      } = {},
    ) => {
      setImporting(true);
      setImportProgress(0);

      try {
        const response = await CommonService.importData(file, {
          ...options,
          onProgress: (percent) => {
            setImportProgress(percent);
            options.onProgress?.(percent);
          },
        });

        if (response.success) {
          message.success(response.message);
        } else {
          message.error(response.message);
        }

        return response;
      } catch (error) {
        message.error('数据导入失败');
        console.error('数据导入失败:', error);
        throw error;
      } finally {
        setImporting(false);
        setImportProgress(0);
      }
    },
    [],
  );

  return {
    importing,
    importProgress,
    importData,
  };
};

/**
 * 批量操作 Hook
 */
export const useBatchOperation = <T = any>() => {
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const batchOperation = useCallback(
    async (
      url: string,
      data: {
        ids: string[];
        operation: string;
        params?: any;
      },
    ): Promise<ApiResponse<T>> => {
      setLoading(true);
      try {
        const response = await CommonService.batchOperation<T>(url, data);
        if (response.success) {
          message.success('批量操作成功');
        } else {
          message.error(response.message || '批量操作失败');
        }
        return response;
      } catch (error) {
        message.error('批量操作失败');
        console.error('批量操作失败:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return {
    loading,
    selectedIds,
    setSelectedIds,
    batchOperation,
    clearSelection,
  };
};

/**
 * 系统信息 Hook
 */
export const useSystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState({
    version: '1.0.0',
    buildTime: '',
    environment: 'development',
    features: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  const fetchSystemInfo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await CommonService.getSystemInfo();
      setSystemInfo(response);
      return response;
    } catch (error) {
      console.error('获取系统信息失败:', error);
      return systemInfo;
    } finally {
      setLoading(false);
    }
  }, [systemInfo]);

  useEffect(() => {
    fetchSystemInfo();
  }, [fetchSystemInfo]);

  return {
    systemInfo,
    loading,
    fetchSystemInfo,
  };
};

/**
 * 健康检查 Hook
 */
export const useHealthCheck = (interval: number = 30000) => {
  const [healthStatus, setHealthStatus] = useState({
    status: 'healthy' as 'healthy' | 'unhealthy',
    timestamp: '',
    services: [] as Array<{
      name: string;
      status: 'up' | 'down';
      responseTime?: number;
    }>,
  });
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await CommonService.healthCheck();
      setHealthStatus(response);
      return response;
    } catch (error) {
      console.error('健康检查失败:', error);
      return healthStatus;
    } finally {
      setLoading(false);
    }
  }, [healthStatus]);

  const startHealthCheck = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 立即检查一次
    checkHealth();

    // 设置定时器
    intervalRef.current = setInterval(() => {
      checkHealth();
    }, interval);
  }, [checkHealth, interval]);

  const stopHealthCheck = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    healthStatus,
    loading,
    checkHealth,
    startHealthCheck,
    stopHealthCheck,
  };
};

/**
 * 配置管理 Hook
 */
export const useConfig = () => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getConfig = useCallback(async (key?: string) => {
    setLoading(true);
    try {
      const response = await CommonService.getConfig(key);
      setConfig(response);
      return response;
    } catch (error) {
      console.error('获取配置失败:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback(
    async (key: string, value: any) => {
      try {
        await CommonService.updateConfig(key, value);
        message.success('配置更新成功');
        await getConfig(key);
      } catch (error) {
        message.error('配置更新失败');
        console.error('配置更新失败:', error);
        throw error;
      }
    },
    [getConfig],
  );

  return {
    config,
    loading,
    getConfig,
    updateConfig,
  };
};

/**
 * 通知发送 Hook
 */
export const useNotification = () => {
  const [sending, setSending] = useState(false);

  const sendNotification = useCallback(
    async (data: {
      type: 'email' | 'sms' | 'push';
      recipients: string[];
      subject?: string;
      content: string;
      template?: string;
      params?: Record<string, any>;
    }) => {
      setSending(true);
      try {
        await CommonService.sendNotification(data);
        message.success('通知发送成功');
      } catch (error) {
        message.error('通知发送失败');
        console.error('通知发送失败:', error);
        throw error;
      } finally {
        setSending(false);
      }
    },
    [],
  );

  return {
    sending,
    sendNotification,
  };
};

/**
 * 日志查看 Hook
 */
export const useLogs = () => {
  const [logs, setLogs] = useState<
    Array<{
      timestamp: string;
      level: string;
      message: string;
      source?: string;
      metadata?: any;
    }>
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(
    async (
      params: {
        level?: 'debug' | 'info' | 'warn' | 'error';
        startTime?: string;
        endTime?: string;
        limit?: number;
        offset?: number;
      } = {},
    ) => {
      setLoading(true);
      try {
        const response = await CommonService.getLogs(params);
        setLogs(response);
        return response;
      } catch (error) {
        console.error('获取日志失败:', error);
        return logs;
      } finally {
        setLoading(false);
      }
    },
    [logs],
  );

  return {
    logs,
    loading,
    fetchLogs,
  };
};

/**
 * 防抖 Hook
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * 节流 Hook
 */
export const useThrottle = <T extends (...args: any[]) => any>(func: T, delay: number): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastExecRef = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastExecRef.current >= delay) {
        lastExecRef.current = now;
        return func(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(
          () => {
            lastExecRef.current = Date.now();
            func(...args);
          },
          delay - (now - lastExecRef.current),
        );
      }
    },
    [func, delay],
  ) as T;
};

/**
 * 本地存储 Hook
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};

/**
 * 会话存储 Hook
 */
export const useSessionStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};

