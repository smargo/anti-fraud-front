import { createLocalDevAccess } from './constants/permissions';
import { isLocalDevelopment } from './utils';
import { ROUTER_PREFIX } from './utils/constants';
import { getMasterProps } from './utils/masterProps';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(
  initialState: { currentUser?: PhoenixAPI.CurrentUser } | undefined,
): Record<string, boolean | undefined> {
  const { currentUser, menus } = getMasterProps();

  // 本地开发环境：提供所有权限
  if (isLocalDevelopment()) {
    console.log('本地开发环境：提供所有权限');
    return createLocalDevAccess();
  }

  // 路由权限
  const accessRoutes: Record<string, boolean> = {};
  const prefix = `/${ROUTER_PREFIX}`;
  function getAccessRoutes(routers: PhoenixAPI.MenuTreeItem[] = []) {
    routers.forEach((route: PhoenixAPI.MenuTreeItem) => {
      if (route.menus) {
        getAccessRoutes(route.menus);
      }
      accessRoutes[route.path.replace(prefix, '')] = !route.meta?.hidden ?? true;
    });
  }
  getAccessRoutes(menus?.menus ?? []);

  // 权限
  const accessKey: Record<string, boolean> = {};
  (currentUser?.permissions ?? currentUser?.authorities ?? []).forEach((auth) => {
    accessKey[auth] = true;
  });
  console.log('access:', {
    ...accessRoutes,
    ...accessKey,
  });
  return {
    ...accessRoutes,
    ...accessKey,
  };
}
