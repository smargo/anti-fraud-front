// Hooks 主入口文件
// 按业务模块组织所有自定义 Hooks

// 反欺诈业务相关 Hooks
export * from './useAntiFraud';

// Phoenix 系统相关 Hooks
export * from './usePhoenix';

// 仪表盘相关 Hooks
export * from './useDashboard';

// 通用工具 Hooks
export * from './useCommon';

// 微前端相关 Hooks
export * from './useMicroApp';

// 现有 Hooks
export * from './useDictData';
export * from './useMessage';

// 兼容性导出 - 保持与现有代码的兼容性
export { useDictData } from './useDictData';
export { useMessage } from './useMessage';
