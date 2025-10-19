import { createLocalDevAccess } from './constants/permissions';
import { isLocalDevelopment } from './utils';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(
  initialState: { currentUser?: PhoenixAPI.CurrentUser } | undefined,
): Record<string, boolean | undefined> {
  // 本地开发环境：提供所有权限
  if (isLocalDevelopment()) {
    console.log('本地开发环境：提供所有权限');
    return createLocalDevAccess();
  }

  // 实际生产环境的权限逻辑
  const accessKey: Record<string, boolean> = {};
  (initialState?.currentUser?.permissions ?? initialState?.currentUser?.authorities ?? []).forEach(
    (auth) => {
      accessKey[auth] = true;
    },
  );

  console.log('access:', accessKey);
  return accessKey;
}
