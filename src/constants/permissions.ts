/**
 * 本地开发环境权限配置
 * 统一管理本地开发环境下的权限列表
 */

// 本地开发环境的所有权限列表
export const LOCAL_DEV_PERMISSIONS = [
  'antifraud:dashboard:readonly',
  'antifraud:event:readonly',
  'antifraud:field:readonly',
  'antifraud:stage:readonly',
  'antifraud:statement:readonly',
  'antifraud:indicator:readonly',
  'antifraud:datasource:readonly',
  'antifraud:dict:readonly',
  'antifraud:ruleManagement:readonly',
  '/dashboard',
  '/event',
  '/field',
  '/stage',
  '/statement',
  '/indicator',
  '/datasource',
  '/dict',
  '/rule-management',
  '/micro-app-demo',
  '/utils-demo',
] as const;

// 权限代码类型
export type LocalDevPermissionCode = (typeof LOCAL_DEV_PERMISSIONS)[number];

/**
 * 创建本地开发环境的权限对象列表
 * 用于 getInitialState 中的用户权限配置
 */
export const createLocalDevPermissions = (): PhoenixAPI.AuthorityListItem[] => {
  return LOCAL_DEV_PERMISSIONS.map((code) => ({
    code,
    name: code,
    enabled: true,
    id: code,
    createTime: new Date().toISOString(),
    lastModifiedTime: new Date().toISOString(),
    createBy: 'system',
    lastModifiedBy: 'system',
    type: 'MENU',
    version: 1,
    menu: {} as PhoenixAPI.MenuTreeItem,
    menuId: code,
  }));
};

/**
 * 创建本地开发环境的访问权限映射
 * 用于 access.ts 中的权限检查
 */
export const createLocalDevAccess = (): Record<string, boolean> => {
  const access: Record<string, boolean> = {};
  LOCAL_DEV_PERMISSIONS.forEach((permission) => {
    access[permission] = true;
  });
  return access;
};

/**
 * 检查是否为本地开发环境权限
 */
export const isLocalDevPermission = (permission: string): permission is LocalDevPermissionCode => {
  return LOCAL_DEV_PERMISSIONS.includes(permission as LocalDevPermissionCode);
};
