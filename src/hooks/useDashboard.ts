import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import { DashboardService } from '@/services/dashboard';
import type {
  DashboardStats,
  RiskAnalysis,
  EventAnalysis,
  TrendData,
  ChartData,
  FilterParams,
  TimeRange,
} from '@/services/dashboard';

/**
 * 仪表盘统计数据 Hook
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    activeRules: 0,
    blockedTransactions: 0,
    riskScore: 0,
    trendData: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(
    async (params?: FilterParams) => {
      setLoading(true);
      try {
        const response = await DashboardService.getDashboardStats(params);
        setStats(response);
        return response;
      } catch (error) {
        message.error('获取仪表盘统计数据失败');
        console.error('获取仪表盘统计数据失败:', error);
        return stats;
      } finally {
        setLoading(false);
      }
    },
    [stats],
  );

  return {
    stats,
    loading,
    fetchStats,
  };
};

/**
 * 风险分析 Hook
 */
export const useRiskAnalysis = () => {
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis>({
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchRiskAnalysis = useCallback(
    async (params?: FilterParams) => {
      setLoading(true);
      try {
        const response = await DashboardService.getRiskAnalysis(params);
        setRiskAnalysis(response);
        return response;
      } catch (error) {
        message.error('获取风险分析数据失败');
        console.error('获取风险分析数据失败:', error);
        return riskAnalysis;
      } finally {
        setLoading(false);
      }
    },
    [riskAnalysis],
  );

  return {
    riskAnalysis,
    loading,
    fetchRiskAnalysis,
  };
};

/**
 * 事件分析 Hook
 */
export const useEventAnalysis = () => {
  const [eventAnalysis, setEventAnalysis] = useState<EventAnalysis[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEventAnalysis = useCallback(
    async (params?: FilterParams) => {
      setLoading(true);
      try {
        const response = await DashboardService.getEventAnalysis(params);
        setEventAnalysis(response);
        return response;
      } catch (error) {
        message.error('获取事件分析数据失败');
        console.error('获取事件分析数据失败:', error);
        return eventAnalysis;
      } finally {
        setLoading(false);
      }
    },
    [eventAnalysis],
  );

  return {
    eventAnalysis,
    loading,
    fetchEventAnalysis,
  };
};

/**
 * 趋势数据 Hook
 */
export const useTrendData = (type: 'events' | 'risk' | 'blocks' = 'events') => {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrendData = useCallback(
    async (params?: FilterParams) => {
      setLoading(true);
      try {
        const response = await DashboardService.getTrendData(type, params);
        setTrendData(response);
        return response;
      } catch (error) {
        message.error(`获取${type}趋势数据失败`);
        console.error(`获取${type}趋势数据失败:`, error);
        return trendData;
      } finally {
        setLoading(false);
      }
    },
    [type, trendData],
  );

  return {
    trendData,
    loading,
    fetchTrendData,
  };
};

/**
 * 图表数据 Hook
 */
export const useChartData = (chartType: 'pie' | 'bar' | 'line' | 'area' = 'pie') => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchChartData = useCallback(
    async (params?: FilterParams) => {
      setLoading(true);
      try {
        const response = await DashboardService.getChartData(chartType, params);
        setChartData(response);
        return response;
      } catch (error) {
        message.error(`获取${chartType}图表数据失败`);
        console.error(`获取${chartType}图表数据失败:`, error);
        return chartData;
      } finally {
        setLoading(false);
      }
    },
    [chartType, chartData],
  );

  return {
    chartData,
    loading,
    fetchChartData,
  };
};

/**
 * 实时数据 Hook
 */
export const useRealtimeData = (interval: number = 5000) => {
  const [realtimeData, setRealtimeData] = useState({
    currentEvents: 0,
    currentRisk: 0,
    alerts: 0,
    lastUpdate: '',
  });
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchRealtimeData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await DashboardService.getRealtimeData();
      setRealtimeData(response);
      return response;
    } catch (error) {
      console.error('获取实时数据失败:', error);
      return realtimeData;
    } finally {
      setLoading(false);
    }
  }, [realtimeData]);

  // 开始轮询
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 立即获取一次数据
    fetchRealtimeData();

    // 设置定时器
    intervalRef.current = setInterval(() => {
      fetchRealtimeData();
    }, interval);
  }, [fetchRealtimeData, interval]);

  // 停止轮询
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    realtimeData,
    loading,
    fetchRealtimeData,
    startPolling,
    stopPolling,
  };
};

/**
 * 告警数据 Hook
 */
export const useAlerts = () => {
  const [alerts, setAlerts] = useState<
    Array<{
      id: string;
      level: 'high' | 'medium' | 'low';
      message: string;
      timestamp: string;
      status: 'active' | 'resolved';
      eventId?: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = useCallback(
    async (params?: {
      level?: 'high' | 'medium' | 'low';
      status?: 'active' | 'resolved';
      limit?: number;
    }) => {
      setLoading(true);
      try {
        const response = await DashboardService.getAlerts(params);
        setAlerts(response);
        return response;
      } catch (error) {
        message.error('获取告警数据失败');
        console.error('获取告警数据失败:', error);
        return alerts;
      } finally {
        setLoading(false);
      }
    },
    [alerts],
  );

  return {
    alerts,
    loading,
    fetchAlerts,
  };
};

/**
 * 性能指标 Hook
 */
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    avgResponseTime: 0,
    throughput: 0,
    errorRate: 0,
    availability: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchMetrics = useCallback(
    async (params?: FilterParams) => {
      setLoading(true);
      try {
        const response = await DashboardService.getPerformanceMetrics(params);
        setMetrics(response);
        return response;
      } catch (error) {
        message.error('获取性能指标失败');
        console.error('获取性能指标失败:', error);
        return metrics;
      } finally {
        setLoading(false);
      }
    },
    [metrics],
  );

  return {
    metrics,
    loading,
    fetchMetrics,
  };
};

/**
 * 数据源状态 Hook
 */
export const useDataSourceStatus = () => {
  const [dataSourceStatus, setDataSourceStatus] = useState<
    Array<{
      id: string;
      name: string;
      status: 'online' | 'offline' | 'error';
      lastUpdate: string;
      latency: number;
    }>
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchDataSourceStatus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await DashboardService.getDataSourceStatus();
      setDataSourceStatus(response);
      return response;
    } catch (error) {
      message.error('获取数据源状态失败');
      console.error('获取数据源状态失败:', error);
      return dataSourceStatus;
    } finally {
      setLoading(false);
    }
  }, [dataSourceStatus]);

  return {
    dataSourceStatus,
    loading,
    fetchDataSourceStatus,
  };
};

/**
 * 系统健康状态 Hook
 */
export const useSystemHealth = () => {
  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy' as 'healthy' | 'warning' | 'critical',
    components: [] as Array<{
      name: string;
      status: 'healthy' | 'warning' | 'critical';
      message?: string;
    }>,
    timestamp: '',
  });
  const [loading, setLoading] = useState(false);

  const fetchSystemHealth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await DashboardService.getSystemHealth();
      setSystemHealth(response);
      return response;
    } catch (error) {
      message.error('获取系统健康状态失败');
      console.error('获取系统健康状态失败:', error);
      return systemHealth;
    } finally {
      setLoading(false);
    }
  }, [systemHealth]);

  return {
    systemHealth,
    loading,
    fetchSystemHealth,
  };
};

/**
 * 仪表盘配置 Hook
 */
export const useDashboardConfig = () => {
  const [config, setConfig] = useState({
    widgets: [] as Array<{
      id: string;
      type: string;
      title: string;
      position: { x: number; y: number; w: number; h: number };
      config: any;
    }>,
    layout: {} as any,
  });
  const [loading, setLoading] = useState(false);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const response = await DashboardService.getDashboardConfig();
      setConfig(response);
      return response;
    } catch (error) {
      message.error('获取仪表盘配置失败');
      console.error('获取仪表盘配置失败:', error);
      return config;
    } finally {
      setLoading(false);
    }
  }, [config]);

  const saveConfig = useCallback(async (newConfig: typeof config) => {
    try {
      await DashboardService.saveDashboardConfig(newConfig);
      setConfig(newConfig);
      message.success('保存仪表盘配置成功');
    } catch (error) {
      message.error('保存仪表盘配置失败');
      console.error('保存仪表盘配置失败:', error);
      throw error;
    }
  }, []);

  return {
    config,
    loading,
    fetchConfig,
    saveConfig,
  };
};

/**
 * 时间范围 Hook
 */
export const useTimeRange = (defaultRange?: TimeRange) => {
  const [timeRange, setTimeRange] = useState<TimeRange>(
    defaultRange || {
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天前
      endTime: new Date().toISOString(), // 现在
    },
  );

  const updateTimeRange = useCallback((newRange: TimeRange) => {
    setTimeRange(newRange);
  }, []);

  const resetTimeRange = useCallback(() => {
    setTimeRange({
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date().toISOString(),
    });
  }, []);

  const setPresetRange = useCallback(
    (preset: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'last90days') => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      let startTime: Date;
      let endTime: Date = now;

      switch (preset) {
        case 'today':
          startTime = startOfDay;
          break;
        case 'yesterday':
          startTime = new Date(startOfDay.getTime() - 24 * 60 * 60 * 1000);
          endTime = startOfDay;
          break;
        case 'last7days':
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last30days':
          startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last90days':
          startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      setTimeRange({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });
    },
    [],
  );

  return {
    timeRange,
    updateTimeRange,
    resetTimeRange,
    setPresetRange,
  };
};

