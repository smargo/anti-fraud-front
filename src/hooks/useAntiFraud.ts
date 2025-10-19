import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import { AntiFraudService } from '@/services/antifraud';
import type {
  EventConfig,
  EventDetail,
  EventVersion,
  DataSource,
  Field,
  Indicator,
  Stage,
  Statement,
} from '@/services/antifraud';

/**
 * 事件配置管理 Hook
 */
export const useEventConfig = () => {
  const [eventConfigs, setEventConfigs] = useState<EventConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<EventConfig | null>(null);

  // 获取事件配置列表
  const fetchEventConfigs = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await AntiFraudService.getEventConfigs(params);
      setEventConfigs(response || []);
      return response;
    } catch (error) {
      message.error('获取事件配置列表失败');
      console.error('获取事件配置列表失败:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取单个事件配置
  const fetchEventConfig = useCallback(async (id: string) => {
    try {
      const response = await AntiFraudService.getEventConfig(id);
      setCurrentConfig(response);
      return response;
    } catch (error) {
      message.error('获取事件配置失败');
      console.error('获取事件配置失败:', error);
      return null;
    }
  }, []);

  // 创建事件配置
  const createEventConfig = useCallback(
    async (data: EventConfig) => {
      try {
        const response = await AntiFraudService.createEventConfig(data);
        message.success('创建事件配置成功');
        await fetchEventConfigs(); // 刷新列表
        return response;
      } catch (error) {
        message.error('创建事件配置失败');
        console.error('创建事件配置失败:', error);
        throw error;
      }
    },
    [fetchEventConfigs],
  );

  // 更新事件配置
  const updateEventConfig = useCallback(
    async (id: string, data: EventConfig) => {
      try {
        const response = await AntiFraudService.updateEventConfig(id, data);
        message.success('更新事件配置成功');
        await fetchEventConfigs(); // 刷新列表
        if (currentConfig?.id === id) {
          setCurrentConfig(response);
        }
        return response;
      } catch (error) {
        message.error('更新事件配置失败');
        console.error('更新事件配置失败:', error);
        throw error;
      }
    },
    [fetchEventConfigs, currentConfig],
  );

  // 删除事件配置
  const deleteEventConfig = useCallback(
    async (id: string) => {
      try {
        await AntiFraudService.deleteEventConfig(id);
        message.success('删除事件配置成功');
        await fetchEventConfigs(); // 刷新列表
        if (currentConfig?.id === id) {
          setCurrentConfig(null);
        }
      } catch (error) {
        message.error('删除事件配置失败');
        console.error('删除事件配置失败:', error);
        throw error;
      }
    },
    [fetchEventConfigs, currentConfig],
  );

  // 批量操作
  const batchCreateEventConfigs = useCallback(
    async (data: EventConfig[]) => {
      try {
        const response = await AntiFraudService.batchCreateEventConfigs(data);
        message.success(`批量创建 ${data.length} 个事件配置成功`);
        await fetchEventConfigs();
        return response;
      } catch (error) {
        message.error('批量创建事件配置失败');
        console.error('批量创建事件配置失败:', error);
        throw error;
      }
    },
    [fetchEventConfigs],
  );

  const batchDeleteEventConfigs = useCallback(
    async (ids: string[]) => {
      try {
        await AntiFraudService.batchDeleteEventConfigs(ids);
        message.success(`批量删除 ${ids.length} 个事件配置成功`);
        await fetchEventConfigs();
      } catch (error) {
        message.error('批量删除事件配置失败');
        console.error('批量删除事件配置失败:', error);
        throw error;
      }
    },
    [fetchEventConfigs],
  );

  return {
    eventConfigs,
    loading,
    currentConfig,
    setCurrentConfig,
    fetchEventConfigs,
    fetchEventConfig,
    createEventConfig,
    updateEventConfig,
    deleteEventConfig,
    batchCreateEventConfigs,
    batchDeleteEventConfigs,
  };
};

/**
 * 事件详情管理 Hook
 */
export const useEventDetail = () => {
  const [eventDetails, setEventDetails] = useState<EventDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDetail, setCurrentDetail] = useState<EventDetail | null>(null);

  const fetchEventDetails = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await AntiFraudService.getEventDetails(params);
      setEventDetails(response || []);
      return response;
    } catch (error) {
      message.error('获取事件详情列表失败');
      console.error('获取事件详情列表失败:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEventDetail = useCallback(async (id: string) => {
    try {
      const response = await AntiFraudService.getEventDetail(id);
      setCurrentDetail(response);
      return response;
    } catch (error) {
      message.error('获取事件详情失败');
      console.error('获取事件详情失败:', error);
      return null;
    }
  }, []);

  const createEventDetail = useCallback(
    async (data: EventDetail) => {
      try {
        const response = await AntiFraudService.createEventDetail(data);
        message.success('创建事件详情成功');
        await fetchEventDetails();
        return response;
      } catch (error) {
        message.error('创建事件详情失败');
        console.error('创建事件详情失败:', error);
        throw error;
      }
    },
    [fetchEventDetails],
  );

  const updateEventDetail = useCallback(
    async (id: string, data: EventDetail) => {
      try {
        const response = await AntiFraudService.updateEventDetail(id, data);
        message.success('更新事件详情成功');
        await fetchEventDetails();
        if (currentDetail?.id === id) {
          setCurrentDetail(response);
        }
        return response;
      } catch (error) {
        message.error('更新事件详情失败');
        console.error('更新事件详情失败:', error);
        throw error;
      }
    },
    [fetchEventDetails, currentDetail],
  );

  const deleteEventDetail = useCallback(
    async (id: string) => {
      try {
        await AntiFraudService.deleteEventDetail(id);
        message.success('删除事件详情成功');
        await fetchEventDetails();
        if (currentDetail?.id === id) {
          setCurrentDetail(null);
        }
      } catch (error) {
        message.error('删除事件详情失败');
        console.error('删除事件详情失败:', error);
        throw error;
      }
    },
    [fetchEventDetails, currentDetail],
  );

  return {
    eventDetails,
    loading,
    currentDetail,
    setCurrentDetail,
    fetchEventDetails,
    fetchEventDetail,
    createEventDetail,
    updateEventDetail,
    deleteEventDetail,
  };
};

/**
 * 数据源管理 Hook
 */
export const useDataSource = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDataSource, setCurrentDataSource] = useState<DataSource | null>(null);

  const fetchDataSources = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await AntiFraudService.getDataSources(params);
      setDataSources(response || []);
      return response;
    } catch (error) {
      message.error('获取数据源列表失败');
      console.error('获取数据源列表失败:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDataSource = useCallback(async (id: string) => {
    try {
      const response = await AntiFraudService.getDataSource(id);
      setCurrentDataSource(response);
      return response;
    } catch (error) {
      message.error('获取数据源失败');
      console.error('获取数据源失败:', error);
      return null;
    }
  }, []);

  const createDataSource = useCallback(
    async (data: DataSource) => {
      try {
        const response = await AntiFraudService.createDataSource(data);
        message.success('创建数据源成功');
        await fetchDataSources();
        return response;
      } catch (error) {
        message.error('创建数据源失败');
        console.error('创建数据源失败:', error);
        throw error;
      }
    },
    [fetchDataSources],
  );

  const updateDataSource = useCallback(
    async (id: string, data: DataSource) => {
      try {
        const response = await AntiFraudService.updateDataSource(id, data);
        message.success('更新数据源成功');
        await fetchDataSources();
        if (currentDataSource?.id === id) {
          setCurrentDataSource(response);
        }
        return response;
      } catch (error) {
        message.error('更新数据源失败');
        console.error('更新数据源失败:', error);
        throw error;
      }
    },
    [fetchDataSources, currentDataSource],
  );

  const deleteDataSource = useCallback(
    async (id: string) => {
      try {
        await AntiFraudService.deleteDataSource(id);
        message.success('删除数据源成功');
        await fetchDataSources();
        if (currentDataSource?.id === id) {
          setCurrentDataSource(null);
        }
      } catch (error) {
        message.error('删除数据源失败');
        console.error('删除数据源失败:', error);
        throw error;
      }
    },
    [fetchDataSources, currentDataSource],
  );

  return {
    dataSources,
    loading,
    currentDataSource,
    setCurrentDataSource,
    fetchDataSources,
    fetchDataSource,
    createDataSource,
    updateDataSource,
    deleteDataSource,
  };
};

/**
 * 字段管理 Hook
 */
export const useField = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentField, setCurrentField] = useState<Field | null>(null);

  const fetchFields = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await AntiFraudService.getFields(params);
      setFields(response || []);
      return response;
    } catch (error) {
      message.error('获取字段列表失败');
      console.error('获取字段列表失败:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchField = useCallback(async (id: string) => {
    try {
      const response = await AntiFraudService.getField(id);
      setCurrentField(response);
      return response;
    } catch (error) {
      message.error('获取字段失败');
      console.error('获取字段失败:', error);
      return null;
    }
  }, []);

  const createField = useCallback(
    async (data: Field) => {
      try {
        const response = await AntiFraudService.createField(data);
        message.success('创建字段成功');
        await fetchFields();
        return response;
      } catch (error) {
        message.error('创建字段失败');
        console.error('创建字段失败:', error);
        throw error;
      }
    },
    [fetchFields],
  );

  const updateField = useCallback(
    async (id: string, data: Field) => {
      try {
        const response = await AntiFraudService.updateField(id, data);
        message.success('更新字段成功');
        await fetchFields();
        if (currentField?.id === id) {
          setCurrentField(response);
        }
        return response;
      } catch (error) {
        message.error('更新字段失败');
        console.error('更新字段失败:', error);
        throw error;
      }
    },
    [fetchFields, currentField],
  );

  const deleteField = useCallback(
    async (id: string) => {
      try {
        await AntiFraudService.deleteField(id);
        message.success('删除字段成功');
        await fetchFields();
        if (currentField?.id === id) {
          setCurrentField(null);
        }
      } catch (error) {
        message.error('删除字段失败');
        console.error('删除字段失败:', error);
        throw error;
      }
    },
    [fetchFields, currentField],
  );

  return {
    fields,
    loading,
    currentField,
    setCurrentField,
    fetchFields,
    fetchField,
    createField,
    updateField,
    deleteField,
  };
};

/**
 * 指标管理 Hook
 */
export const useIndicator = () => {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndicator, setCurrentIndicator] = useState<Indicator | null>(null);

  const fetchIndicators = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await AntiFraudService.getIndicators(params);
      setIndicators(response || []);
      return response;
    } catch (error) {
      message.error('获取指标列表失败');
      console.error('获取指标列表失败:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchIndicator = useCallback(async (id: string) => {
    try {
      const response = await AntiFraudService.getIndicator(id);
      setCurrentIndicator(response);
      return response;
    } catch (error) {
      message.error('获取指标失败');
      console.error('获取指标失败:', error);
      return null;
    }
  }, []);

  const createIndicator = useCallback(
    async (data: Indicator) => {
      try {
        const response = await AntiFraudService.createIndicator(data);
        message.success('创建指标成功');
        await fetchIndicators();
        return response;
      } catch (error) {
        message.error('创建指标失败');
        console.error('创建指标失败:', error);
        throw error;
      }
    },
    [fetchIndicators],
  );

  const updateIndicator = useCallback(
    async (id: string, data: Indicator) => {
      try {
        const response = await AntiFraudService.updateIndicator(id, data);
        message.success('更新指标成功');
        await fetchIndicators();
        if (currentIndicator?.id === id) {
          setCurrentIndicator(response);
        }
        return response;
      } catch (error) {
        message.error('更新指标失败');
        console.error('更新指标失败:', error);
        throw error;
      }
    },
    [fetchIndicators, currentIndicator],
  );

  const deleteIndicator = useCallback(
    async (id: string) => {
      try {
        await AntiFraudService.deleteIndicator(id);
        message.success('删除指标成功');
        await fetchIndicators();
        if (currentIndicator?.id === id) {
          setCurrentIndicator(null);
        }
      } catch (error) {
        message.error('删除指标失败');
        console.error('删除指标失败:', error);
        throw error;
      }
    },
    [fetchIndicators, currentIndicator],
  );

  return {
    indicators,
    loading,
    currentIndicator,
    setCurrentIndicator,
    fetchIndicators,
    fetchIndicator,
    createIndicator,
    updateIndicator,
    deleteIndicator,
  };
};

/**
 * 阶段管理 Hook
 */
export const useStage = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<Stage | null>(null);

  const fetchStages = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await AntiFraudService.getStages(params);
      setStages(response || []);
      return response;
    } catch (error) {
      message.error('获取阶段列表失败');
      console.error('获取阶段列表失败:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStage = useCallback(async (id: string) => {
    try {
      const response = await AntiFraudService.getStage(id);
      setCurrentStage(response);
      return response;
    } catch (error) {
      message.error('获取阶段失败');
      console.error('获取阶段失败:', error);
      return null;
    }
  }, []);

  const createStage = useCallback(
    async (data: Stage) => {
      try {
        const response = await AntiFraudService.createStage(data);
        message.success('创建阶段成功');
        await fetchStages();
        return response;
      } catch (error) {
        message.error('创建阶段失败');
        console.error('创建阶段失败:', error);
        throw error;
      }
    },
    [fetchStages],
  );

  const updateStage = useCallback(
    async (id: string, data: Stage) => {
      try {
        const response = await AntiFraudService.updateStage(id, data);
        message.success('更新阶段成功');
        await fetchStages();
        if (currentStage?.id === id) {
          setCurrentStage(response);
        }
        return response;
      } catch (error) {
        message.error('更新阶段失败');
        console.error('更新阶段失败:', error);
        throw error;
      }
    },
    [fetchStages, currentStage],
  );

  const deleteStage = useCallback(
    async (id: string) => {
      try {
        await AntiFraudService.deleteStage(id);
        message.success('删除阶段成功');
        await fetchStages();
        if (currentStage?.id === id) {
          setCurrentStage(null);
        }
      } catch (error) {
        message.error('删除阶段失败');
        console.error('删除阶段失败:', error);
        throw error;
      }
    },
    [fetchStages, currentStage],
  );

  return {
    stages,
    loading,
    currentStage,
    setCurrentStage,
    fetchStages,
    fetchStage,
    createStage,
    updateStage,
    deleteStage,
  };
};

/**
 * 语句管理 Hook
 */
export const useStatement = () => {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStatement, setCurrentStatement] = useState<Statement | null>(null);

  const fetchStatements = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await AntiFraudService.getStatements(params);
      setStatements(response || []);
      return response;
    } catch (error) {
      message.error('获取语句列表失败');
      console.error('获取语句列表失败:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatement = useCallback(async (id: string) => {
    try {
      const response = await AntiFraudService.getStatement(id);
      setCurrentStatement(response);
      return response;
    } catch (error) {
      message.error('获取语句失败');
      console.error('获取语句失败:', error);
      return null;
    }
  }, []);

  const createStatement = useCallback(
    async (data: Statement) => {
      try {
        const response = await AntiFraudService.createStatement(data);
        message.success('创建语句成功');
        await fetchStatements();
        return response;
      } catch (error) {
        message.error('创建语句失败');
        console.error('创建语句失败:', error);
        throw error;
      }
    },
    [fetchStatements],
  );

  const updateStatement = useCallback(
    async (id: string, data: Statement) => {
      try {
        const response = await AntiFraudService.updateStatement(id, data);
        message.success('更新语句成功');
        await fetchStatements();
        if (currentStatement?.id === id) {
          setCurrentStatement(response);
        }
        return response;
      } catch (error) {
        message.error('更新语句失败');
        console.error('更新语句失败:', error);
        throw error;
      }
    },
    [fetchStatements, currentStatement],
  );

  const deleteStatement = useCallback(
    async (id: string) => {
      try {
        await AntiFraudService.deleteStatement(id);
        message.success('删除语句成功');
        await fetchStatements();
        if (currentStatement?.id === id) {
          setCurrentStatement(null);
        }
      } catch (error) {
        message.error('删除语句失败');
        console.error('删除语句失败:', error);
        throw error;
      }
    },
    [fetchStatements, currentStatement],
  );

  return {
    statements,
    loading,
    currentStatement,
    setCurrentStatement,
    fetchStatements,
    fetchStatement,
    createStatement,
    updateStatement,
    deleteStatement,
  };
};

