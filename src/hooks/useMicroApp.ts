import { useState, useEffect, useCallback } from 'react';
import { getMasterProps } from '@/utils/masterProps';
import { MicroAppUtils } from '@/utils/microApp';

/**
 * 微前端环境检测 Hook
 */
export const useMicroAppEnvironment = () => {
  const [isMicroApp, setIsMicroApp] = useState(false);
  const [isMainApp, setIsMainApp] = useState(false);
  const [appName, setAppName] = useState<string>('');

  useEffect(() => {
    const environment = MicroAppUtils.getEnvironment();
    setIsMicroApp(environment.isMicroApp);
    setIsMainApp(environment.isMainApp);
    setAppName(environment.appName);
  }, []);

  return {
    isMicroApp,
    isMainApp,
    appName,
  };
};

/**
 * 微前端通信 Hook
 */
export const useMicroAppCommunication = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = () => {
      const connected = MicroAppUtils.isConnected();
      setIsConnected(connected);
    };

    checkConnection();

    // 定期检查连接状态
    const interval = setInterval(checkConnection, 5000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = useCallback((message: any) => {
    try {
      MicroAppUtils.sendMessage(message);
      return true;
    } catch (error) {
      console.error('发送消息失败:', error);
      return false;
    }
  }, []);

  const sendMessageToMain = useCallback((message: any) => {
    try {
      MicroAppUtils.sendMessageToMain(message);
      return true;
    } catch (error) {
      console.error('向主应用发送消息失败:', error);
      return false;
    }
  }, []);

  const sendMessageToMicroApp = useCallback((targetApp: string, message: any) => {
    try {
      MicroAppUtils.sendMessageToMicroApp(targetApp, message);
      return true;
    } catch (error) {
      console.error('向微应用发送消息失败:', error);
      return false;
    }
  }, []);

  const broadcastMessage = useCallback((message: any) => {
    try {
      MicroAppUtils.broadcastMessage(message);
      return true;
    } catch (error) {
      console.error('广播消息失败:', error);
      return false;
    }
  }, []);

  const onMessage = useCallback((callback: (message: any) => void) => {
    return MicroAppUtils.onMessage(callback);
  }, []);

  const onMessageFromMain = useCallback((callback: (message: any) => void) => {
    return MicroAppUtils.onMessageFromMain(callback);
  }, []);

  const onMessageFromMicroApp = useCallback(
    (targetApp: string, callback: (message: any) => void) => {
      return MicroAppUtils.onMessageFromMicroApp(targetApp, callback);
    },
    [],
  );

  const onBroadcastMessage = useCallback((callback: (message: any) => void) => {
    return MicroAppUtils.onBroadcastMessage(callback);
  }, []);

  return {
    isConnected,
    sendMessage,
    sendMessageToMain,
    sendMessageToMicroApp,
    broadcastMessage,
    onMessage,
    onMessageFromMain,
    onMessageFromMicroApp,
    onBroadcastMessage,
  };
};

/**
 * 微前端状态管理 Hook
 */
export const useMicroAppState = () => {
  const [globalState, setGlobalState] = useState<any>({});
  const [localState, setLocalState] = useState<any>({});

  useEffect(() => {
    const state = MicroAppUtils.getGlobalState();
    setGlobalState(state);
  }, []);

  const setGlobalStateValue = useCallback((key: string, value: any) => {
    try {
      MicroAppUtils.setGlobalState(key, value);
      setGlobalState((prev) => ({ ...prev, [key]: value }));
      return true;
    } catch (error) {
      console.error('设置全局状态失败:', error);
      return false;
    }
  }, []);

  const getGlobalStateValue = useCallback((key: string) => {
    try {
      return MicroAppUtils.getGlobalStateValue(key);
    } catch (error) {
      console.error('获取全局状态失败:', error);
      return undefined;
    }
  }, []);

  const removeGlobalStateValue = useCallback((key: string) => {
    try {
      MicroAppUtils.removeGlobalState(key);
      setGlobalState((prev) => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
      return true;
    } catch (error) {
      console.error('删除全局状态失败:', error);
      return false;
    }
  }, []);

  const clearGlobalState = useCallback(() => {
    try {
      MicroAppUtils.clearGlobalState();
      setGlobalState({});
      return true;
    } catch (error) {
      console.error('清空全局状态失败:', error);
      return false;
    }
  }, []);

  const onGlobalStateChange = useCallback((callback: (state: any) => void) => {
    return MicroAppUtils.onGlobalStateChange(callback);
  }, []);

  const setLocalStateValue = useCallback((key: string, value: any) => {
    setLocalState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const getLocalStateValue = useCallback(
    (key: string) => {
      return localState[key];
    },
    [localState],
  );

  const removeLocalStateValue = useCallback((key: string) => {
    setLocalState((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  const clearLocalState = useCallback(() => {
    setLocalState({});
  }, []);

  return {
    globalState,
    localState,
    setGlobalStateValue,
    getGlobalStateValue,
    removeGlobalStateValue,
    clearGlobalState,
    onGlobalStateChange,
    setLocalStateValue,
    getLocalStateValue,
    removeLocalStateValue,
    clearLocalState,
  };
};

/**
 * 微前端路由管理 Hook
 */
export const useMicroAppRouter = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('');
  const [routeHistory, setRouteHistory] = useState<string[]>([]);

  useEffect(() => {
    const route = MicroAppUtils.getCurrentRoute();
    setCurrentRoute(route);
  }, []);

  const navigateTo = useCallback((path: string) => {
    try {
      MicroAppUtils.navigateTo(path);
      setCurrentRoute(path);
      setRouteHistory((prev) => [...prev, path]);
      return true;
    } catch (error) {
      console.error('导航失败:', error);
      return false;
    }
  }, []);

  const navigateBack = useCallback(() => {
    try {
      MicroAppUtils.navigateBack();
      setRouteHistory((prev) => {
        const newHistory = [...prev];
        newHistory.pop();
        const newRoute = newHistory[newHistory.length - 1] || '';
        setCurrentRoute(newRoute);
        return newHistory;
      });
      return true;
    } catch (error) {
      console.error('返回导航失败:', error);
      return false;
    }
  }, []);

  const navigateToMain = useCallback((path: string) => {
    try {
      MicroAppUtils.navigateToMain(path);
      return true;
    } catch (error) {
      console.error('导航到主应用失败:', error);
      return false;
    }
  }, []);

  const navigateToMicroApp = useCallback((appName: string, path: string) => {
    try {
      MicroAppUtils.navigateToMicroApp(appName, path);
      return true;
    } catch (error) {
      console.error('导航到微应用失败:', error);
      return false;
    }
  }, []);

  const getRouteParams = useCallback(() => {
    try {
      return MicroAppUtils.getRouteParams();
    } catch (error) {
      console.error('获取路由参数失败:', error);
      return {};
    }
  }, []);

  const setRouteParams = useCallback((params: Record<string, any>) => {
    try {
      MicroAppUtils.setRouteParams(params);
      return true;
    } catch (error) {
      console.error('设置路由参数失败:', error);
      return false;
    }
  }, []);

  return {
    currentRoute,
    routeHistory,
    navigateTo,
    navigateBack,
    navigateToMain,
    navigateToMicroApp,
    getRouteParams,
    setRouteParams,
  };
};

/**
 * 微前端生命周期 Hook
 */
export const useMicroAppLifecycle = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleMount = () => {
      setIsMounted(true);
      setIsUnmounted(false);
    };

    const handleUnmount = () => {
      setIsMounted(false);
      setIsUnmounted(true);
    };

    MicroAppUtils.onMount(handleMount);
    MicroAppUtils.onUnmount(handleUnmount);

    return () => {
      MicroAppUtils.offMount(handleMount);
      MicroAppUtils.offUnmount(handleUnmount);
    };
  }, []);

  const onMount = useCallback((callback: () => void) => {
    return MicroAppUtils.onMount(callback);
  }, []);

  const onUnmount = useCallback((callback: () => void) => {
    return MicroAppUtils.onUnmount(callback);
  }, []);

  const onShow = useCallback((callback: () => void) => {
    return MicroAppUtils.onShow(callback);
  }, []);

  const onHide = useCallback((callback: () => void) => {
    return MicroAppUtils.onHide(callback);
  }, []);

  const onError = useCallback((callback: (error: Error) => void) => {
    return MicroAppUtils.onError(callback);
  }, []);

  return {
    isMounted,
    isUnmounted,
    onMount,
    onUnmount,
    onShow,
    onHide,
    onError,
  };
};

/**
 * 微前端主应用属性 Hook
 */
export const useMasterProps = () => {
  const [masterProps, setMasterProps] = useState<any>({});

  useEffect(() => {
    const props = getMasterProps();
    setMasterProps(props);
  }, []);

  const getMasterProp = useCallback((key: string) => {
    const props = getMasterProps();
    return props[key];
  }, []);

  const hasMasterProp = useCallback((key: string) => {
    const props = getMasterProps();
    return key in props;
  }, []);

  return {
    masterProps,
    getMasterProp,
    hasMasterProp,
  };
};

/**
 * 微前端工具 Hook
 */
export const useMicroAppUtils = () => {
  const getAppInfo = useCallback(() => {
    return MicroAppUtils.getAppInfo();
  }, []);

  const getMainAppInfo = useCallback(() => {
    return MicroAppUtils.getMainAppInfo();
  }, []);

  const getMicroAppInfo = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppInfo(appName);
  }, []);

  const getAllMicroApps = useCallback(() => {
    return MicroAppUtils.getAllMicroApps();
  }, []);

  const isMicroAppRunning = useCallback((appName: string) => {
    return MicroAppUtils.isMicroAppRunning(appName);
  }, []);

  const getMicroAppStatus = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppStatus(appName);
  }, []);

  const getMicroAppVersion = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppVersion(appName);
  }, []);

  const getMicroAppConfig = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppConfig(appName);
  }, []);

  const getMicroAppDependencies = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppDependencies(appName);
  }, []);

  const getMicroAppResources = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppResources(appName);
  }, []);

  const getMicroAppPerformance = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPerformance(appName);
  }, []);

  const getMicroAppErrors = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppErrors(appName);
  }, []);

  const getMicroAppLogs = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppLogs(appName);
  }, []);

  const getMicroAppMetrics = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppMetrics(appName);
  }, []);

  const getMicroAppHealth = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppHealth(appName);
  }, []);

  const getMicroAppSecurity = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppSecurity(appName);
  }, []);

  const getMicroAppCompliance = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppCompliance(appName);
  }, []);

  const getMicroAppAudit = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppAudit(appName);
  }, []);

  const getMicroAppBackup = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppBackup(appName);
  }, []);

  const getMicroAppRestore = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppRestore(appName);
  }, []);

  const getMicroAppMigration = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppMigration(appName);
  }, []);

  const getMicroAppScaling = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppScaling(appName);
  }, []);

  const getMicroAppMonitoring = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppMonitoring(appName);
  }, []);

  const getMicroAppAlerting = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppAlerting(appName);
  }, []);

  const getMicroAppReporting = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppReporting(appName);
  }, []);

  const getMicroAppAnalytics = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppAnalytics(appName);
  }, []);

  const getMicroAppInsights = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppInsights(appName);
  }, []);

  const getMicroAppRecommendations = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppRecommendations(appName);
  }, []);

  const getMicroAppOptimizations = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppOptimizations(appName);
  }, []);

  const getMicroAppTroubleshooting = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppTroubleshooting(appName);
  }, []);

  const getMicroAppSupport = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppSupport(appName);
  }, []);

  const getMicroAppDocumentation = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppDocumentation(appName);
  }, []);

  const getMicroAppTraining = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppTraining(appName);
  }, []);

  const getMicroAppCommunity = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppCommunity(appName);
  }, []);

  const getMicroAppFeedback = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppFeedback(appName);
  }, []);

  const getMicroAppRoadmap = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppRoadmap(appName);
  }, []);

  const getMicroAppChangelog = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppChangelog(appName);
  }, []);

  const getMicroAppLicense = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppLicense(appName);
  }, []);

  const getMicroAppPricing = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPricing(appName);
  }, []);

  const getMicroAppBilling = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppBilling(appName);
  }, []);

  const getMicroAppUsage = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppUsage(appName);
  }, []);

  const getMicroAppLimits = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppLimits(appName);
  }, []);

  const getMicroAppQuotas = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppQuotas(appName);
  }, []);

  const getMicroAppPolicies = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPolicies(appName);
  }, []);

  const getMicroAppTerms = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppTerms(appName);
  }, []);

  const getMicroAppPrivacy = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPrivacy(appName);
  }, []);

  const getMicroAppCookies = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppCookies(appName);
  }, []);

  const getMicroAppGDPR = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppGDPR(appName);
  }, []);

  const getMicroAppCCPA = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppCCPA(appName);
  }, []);

  const getMicroAppLGPD = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppLGPD(appName);
  }, []);

  const getMicroAppPIPEDA = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPIPEDA(appName);
  }, []);

  const getMicroAppPDPA = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPA(appName);
  }, []);

  const getMicroAppPOPI = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPOPI(appName);
  }, []);

  const getMicroAppFADP = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppFADP(appName);
  }, []);

  const getMicroAppPDPO = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPO(appName);
  }, []);

  const getMicroAppPDPB = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPB(appName);
  }, []);

  const getMicroAppPDPC = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPC(appName);
  }, []);

  const getMicroAppPDPD = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPD(appName);
  }, []);

  const getMicroAppPDPE = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPE(appName);
  }, []);

  const getMicroAppPDPF = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPF(appName);
  }, []);

  const getMicroAppPDPG = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPG(appName);
  }, []);

  const getMicroAppPDPH = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPH(appName);
  }, []);

  const getMicroAppPDPI = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPI(appName);
  }, []);

  const getMicroAppPDPJ = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPJ(appName);
  }, []);

  const getMicroAppPDPK = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPK(appName);
  }, []);

  const getMicroAppPDPL = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPL(appName);
  }, []);

  const getMicroAppPDPM = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPM(appName);
  }, []);

  const getMicroAppPDPN = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPN(appName);
  }, []);

  const getMicroAppPDPP = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPP(appName);
  }, []);

  const getMicroAppPDPQ = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPQ(appName);
  }, []);

  const getMicroAppPDPR = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPR(appName);
  }, []);

  const getMicroAppPDPS = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPS(appName);
  }, []);

  const getMicroAppPDPT = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPT(appName);
  }, []);

  const getMicroAppPDPU = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPU(appName);
  }, []);

  const getMicroAppPDPV = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPV(appName);
  }, []);

  const getMicroAppPDPW = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPW(appName);
  }, []);

  const getMicroAppPDPX = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPX(appName);
  }, []);

  const getMicroAppPDPY = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPY(appName);
  }, []);

  const getMicroAppPDPZ = useCallback((appName: string) => {
    return MicroAppUtils.getMicroAppPDPZ(appName);
  }, []);

  return {
    getAppInfo,
    getMainAppInfo,
    getMicroAppInfo,
    getAllMicroApps,
    isMicroAppRunning,
    getMicroAppStatus,
    getMicroAppVersion,
    getMicroAppConfig,
    getMicroAppDependencies,
    getMicroAppResources,
    getMicroAppPerformance,
    getMicroAppErrors,
    getMicroAppLogs,
    getMicroAppMetrics,
    getMicroAppHealth,
    getMicroAppSecurity,
    getMicroAppCompliance,
    getMicroAppAudit,
    getMicroAppBackup,
    getMicroAppRestore,
    getMicroAppMigration,
    getMicroAppScaling,
    getMicroAppMonitoring,
    getMicroAppAlerting,
    getMicroAppReporting,
    getMicroAppAnalytics,
    getMicroAppInsights,
    getMicroAppRecommendations,
    getMicroAppOptimizations,
    getMicroAppTroubleshooting,
    getMicroAppSupport,
    getMicroAppDocumentation,
    getMicroAppTraining,
    getMicroAppCommunity,
    getMicroAppFeedback,
    getMicroAppRoadmap,
    getMicroAppChangelog,
    getMicroAppLicense,
    getMicroAppPricing,
    getMicroAppBilling,
    getMicroAppUsage,
    getMicroAppLimits,
    getMicroAppQuotas,
    getMicroAppPolicies,
    getMicroAppTerms,
    getMicroAppPrivacy,
    getMicroAppCookies,
    getMicroAppGDPR,
    getMicroAppCCPA,
    getMicroAppLGPD,
    getMicroAppPIPEDA,
    getMicroAppPDPA,
    getMicroAppPOPI,
    getMicroAppFADP,
    getMicroAppPDPO,
    getMicroAppPDPB,
    getMicroAppPDPC,
    getMicroAppPDPD,
    getMicroAppPDPE,
    getMicroAppPDPF,
    getMicroAppPDPG,
    getMicroAppPDPH,
    getMicroAppPDPI,
    getMicroAppPDPJ,
    getMicroAppPDPK,
    getMicroAppPDPL,
    getMicroAppPDPM,
    getMicroAppPDPN,
    getMicroAppPDPO,
    getMicroAppPDPP,
    getMicroAppPDPQ,
    getMicroAppPDPR,
    getMicroAppPDPS,
    getMicroAppPDPT,
    getMicroAppPDPU,
    getMicroAppPDPV,
    getMicroAppPDPW,
    getMicroAppPDPX,
    getMicroAppPDPY,
    getMicroAppPDPZ,
  };
};
