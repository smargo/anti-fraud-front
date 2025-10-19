import { request } from '@umijs/max';

// 仪表盘相关类型定义
export interface DashboardStats {
  totalEvents: number;
  activeRules: number;
  blockedTransactions: number;
  riskScore: number;
  trendData: TrendData[];
}

export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

export interface ChartData {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
}

export interface RiskAnalysis {
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  total: number;
}

export interface EventAnalysis {
  eventType: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TimeRange {
  startTime: string;
  endTime: string;
}

export interface FilterParams {
  timeRange?: TimeRange;
  eventTypes?: string[];
  riskLevels?: string[];
  dataSources?: string[];
}

/**
 * 仪表盘服务
 */
export class DashboardService {
  // 获取仪表盘统计数据
  static async getDashboardStats(params?: FilterParams): Promise<DashboardStats> {
    try {
      const response = await request('/api/dashboard/stats', {
        method: 'GET',
        params,
      });

      return {
        totalEvents: response.totalEvents || 0,
        activeRules: response.activeRules || 0,
        blockedTransactions: response.blockedTransactions || 0,
        riskScore: response.riskScore || 0,
        trendData: response.trendData || [],
      };
    } catch (error) {
      console.error('获取仪表盘统计数据失败', error);
      return {
        totalEvents: 0,
        activeRules: 0,
        blockedTransactions: 0,
        riskScore: 0,
        trendData: [],
      };
    }
  }

  // 获取风险分析数据
  static async getRiskAnalysis(params?: FilterParams): Promise<RiskAnalysis> {
    try {
      const response = await request('/api/dashboard/risk-analysis', {
        method: 'GET',
        params,
      });

      return {
        highRisk: response.highRisk || 0,
        mediumRisk: response.mediumRisk || 0,
        lowRisk: response.lowRisk || 0,
        total: response.total || 0,
      };
    } catch (error) {
      console.error('获取风险分析数据失败', error);
      return {
        highRisk: 0,
        mediumRisk: 0,
        lowRisk: 0,
        total: 0,
      };
    }
  }

  // 获取事件分析数据
  static async getEventAnalysis(params?: FilterParams): Promise<EventAnalysis[]> {
    try {
      const response = await request('/api/dashboard/event-analysis', {
        method: 'GET',
        params,
      });

      return response || [];
    } catch (error) {
      console.error('获取事件分析数据失败', error);
      return [];
    }
  }

  // 获取趋势数据
  static async getTrendData(
    type: 'events' | 'risk' | 'blocks',
    params?: FilterParams,
  ): Promise<TrendData[]> {
    try {
      const response = await request(`/api/dashboard/trend/${type}`, {
        method: 'GET',
        params,
      });

      return response || [];
    } catch (error) {
      console.error(`获取${type}趋势数据失败`, error);
      return [];
    }
  }

  // 获取图表数据
  static async getChartData(
    chartType: 'pie' | 'bar' | 'line' | 'area',
    params?: FilterParams,
  ): Promise<ChartData[]> {
    try {
      const response = await request(`/api/dashboard/chart/${chartType}`, {
        method: 'GET',
        params,
      });

      return response || [];
    } catch (error) {
      console.error(`获取${chartType}图表数据失败`, error);
      return [];
    }
  }

  // 获取实时数据
  static async getRealtimeData(): Promise<{
    currentEvents: number;
    currentRisk: number;
    alerts: number;
    lastUpdate: string;
  }> {
    try {
      const response = await request('/api/dashboard/realtime', {
        method: 'GET',
      });

      return {
        currentEvents: response.currentEvents || 0,
        currentRisk: response.currentRisk || 0,
        alerts: response.alerts || 0,
        lastUpdate: response.lastUpdate || new Date().toISOString(),
      };
    } catch (error) {
      console.error('获取实时数据失败', error);
      return {
        currentEvents: 0,
        currentRisk: 0,
        alerts: 0,
        lastUpdate: new Date().toISOString(),
      };
    }
  }

  // 获取告警数据
  static async getAlerts(params?: {
    level?: 'high' | 'medium' | 'low';
    status?: 'active' | 'resolved';
    limit?: number;
  }): Promise<
    Array<{
      id: string;
      level: 'high' | 'medium' | 'low';
      message: string;
      timestamp: string;
      status: 'active' | 'resolved';
      eventId?: string;
    }>
  > {
    try {
      const response = await request('/api/dashboard/alerts', {
        method: 'GET',
        params,
      });

      return response || [];
    } catch (error) {
      console.error('获取告警数据失败', error);
      return [];
    }
  }

  // 获取性能指标
  static async getPerformanceMetrics(params?: FilterParams): Promise<{
    avgResponseTime: number;
    throughput: number;
    errorRate: number;
    availability: number;
  }> {
    try {
      const response = await request('/api/dashboard/performance', {
        method: 'GET',
        params,
      });

      return {
        avgResponseTime: response.avgResponseTime || 0,
        throughput: response.throughput || 0,
        errorRate: response.errorRate || 0,
        availability: response.availability || 0,
      };
    } catch (error) {
      console.error('获取性能指标失败', error);
      return {
        avgResponseTime: 0,
        throughput: 0,
        errorRate: 0,
        availability: 0,
      };
    }
  }

  // 导出仪表盘数据
  static async exportDashboardData(
    type: 'stats' | 'analysis' | 'trend',
    params?: FilterParams,
  ): Promise<Blob> {
    try {
      const response = await request(`/api/dashboard/export/${type}`, {
        method: 'GET',
        params,
        responseType: 'blob',
      });

      return response;
    } catch (error) {
      console.error(`导出${type}数据失败`, error);
      throw error;
    }
  }

  // 获取仪表盘配置
  static async getDashboardConfig(): Promise<{
    widgets: Array<{
      id: string;
      type: string;
      title: string;
      position: { x: number; y: number; w: number; h: number };
      config: any;
    }>;
    layout: any;
  }> {
    try {
      const response = await request('/api/dashboard/config', {
        method: 'GET',
      });

      return response || { widgets: [], layout: {} };
    } catch (error) {
      console.error('获取仪表盘配置失败', error);
      return { widgets: [], layout: {} };
    }
  }

  // 保存仪表盘配置
  static async saveDashboardConfig(config: {
    widgets: Array<{
      id: string;
      type: string;
      title: string;
      position: { x: number; y: number; w: number; h: number };
      config: any;
    }>;
    layout: any;
  }): Promise<void> {
    try {
      await request('/api/dashboard/config', {
        method: 'POST',
        data: config,
      });
    } catch (error) {
      console.error('保存仪表盘配置失败', error);
      throw error;
    }
  }

  // 获取数据源状态
  static async getDataSourceStatus(): Promise<
    Array<{
      id: string;
      name: string;
      status: 'online' | 'offline' | 'error';
      lastUpdate: string;
      latency: number;
    }>
  > {
    try {
      const response = await request('/api/dashboard/data-sources/status', {
        method: 'GET',
      });

      return response || [];
    } catch (error) {
      console.error('获取数据源状态失败', error);
      return [];
    }
  }

  // 获取系统健康状态
  static async getSystemHealth(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    components: Array<{
      name: string;
      status: 'healthy' | 'warning' | 'critical';
      message?: string;
    }>;
    timestamp: string;
  }> {
    try {
      const response = await request('/api/dashboard/system-health', {
        method: 'GET',
      });

      return {
        status: response.status || 'healthy',
        components: response.components || [],
        timestamp: response.timestamp || new Date().toISOString(),
      };
    } catch (error) {
      console.error('获取系统健康状态失败', error);
      return {
        status: 'critical',
        components: [],
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// 兼容性导出
export const getDashboardStats = DashboardService.getDashboardStats;
export const getRiskAnalysis = DashboardService.getRiskAnalysis;
export const getEventAnalysis = DashboardService.getEventAnalysis;
export const getTrendData = DashboardService.getTrendData;
export const getChartData = DashboardService.getChartData;
export const getRealtimeData = DashboardService.getRealtimeData;
export const getAlerts = DashboardService.getAlerts;
export const getPerformanceMetrics = DashboardService.getPerformanceMetrics;
export const exportDashboardData = DashboardService.exportDashboardData;
export const getDashboardConfig = DashboardService.getDashboardConfig;
export const saveDashboardConfig = DashboardService.saveDashboardConfig;
export const getDataSourceStatus = DashboardService.getDataSourceStatus;
export const getSystemHealth = DashboardService.getSystemHealth;

