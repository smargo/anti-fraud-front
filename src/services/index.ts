// 服务层主入口文件
// 按业务模块组织所有服务

// 反欺诈业务服务
export * from './antifraud';

// Phoenix 系统服务
export * from './phoenix';

// 字典服务
export * from './dict';

// 仪表盘服务
export * from './dashboard';

// 通用服务
export * from './common';

// 兼容性导出 - 保持与现有代码的兼容性
export { request } from './common';
export { getDictData, getDictText, getDictOptions } from './dict';
export {
  getEventConfigs,
  getEventConfig,
  createEventConfig,
  updateEventConfig,
  deleteEventConfig,
  getEventDetails,
  getEventDetail,
  createEventDetail,
  updateEventDetail,
  deleteEventDetail,
  getDataSources,
  getDataSource,
  createDataSource,
  updateDataSource,
  deleteDataSource,
  getFields,
  getField,
  createField,
  updateField,
  deleteField,
  getIndicators,
  getIndicator,
  createIndicator,
  updateIndicator,
  deleteIndicator,
  getStages,
  getStage,
  createStage,
  updateStage,
  deleteStage,
  getStatements,
  getStatement,
  createStatement,
  updateStatement,
  deleteStatement,
  getStatementDependencies,
  getStatementDependency,
  createStatementDependency,
  updateStatementDependency,
  deleteStatementDependency,
} from './antifraud';
export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  getPermission,
  createPermission,
  updatePermission,
  deletePermission,
  getMenus,
  getMenuTree,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  getDictionaries,
  getDictionary,
  getDictionaryByCode,
  createDictionary,
  updateDictionary,
  deleteDictionary,
  login,
  logout,
  getCurrentUser,
  refreshToken,
  uploadFile,
  uploadFiles,
} from './phoenix';
export {
  getDashboardStats,
  getRiskAnalysis,
  getEventAnalysis,
  getTrendData,
  getChartData,
  getRealtimeData,
  getAlerts,
  getPerformanceMetrics,
  exportDashboardData,
  getDashboardConfig,
  saveDashboardConfig,
  getDataSourceStatus,
  getSystemHealth,
} from './dashboard';
export {
  requestWithPagination,
  downloadFile,
  exportData,
  importData,
  batchOperation,
  getSystemInfo,
  healthCheck,
  getConfig,
  updateConfig,
  sendNotification,
  getLogs,
} from './common';

