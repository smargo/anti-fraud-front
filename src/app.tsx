import { Question } from '@/components/RightContent';
import { Settings as LayoutSettings, PageLoading, SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { AvatarDropdown, AvatarName } from './components/RightContent/AvatarDropdown';
import { errorConfig } from './requestErrorConfig';
// import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { App, ConfigProvider, message } from 'antd';
import locale from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { createLocalDevPermissions } from './constants/permissions';
import { isDev, isLocal, isLocalDevelopment } from './utils';
import { setMasterProps } from './utils/masterProps';
dayjs.locale('zh-cn');
const loginPath = '/user/login';

// message 配置
message.config({
  top: 100,
  duration: 2,
  // rtl: true,
  prefixCls: '',
  maxCount: 2,
});

const handleFromPortal = () => {
  return new Promise((resolve) => {
    window.addEventListener('message', (e) => {
      const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      if (data.type === 'localStorageData') {
        const token = data.data?.['x-auth-token'];
        const PhoenixConfig = data.data?.['Phoenix:config'];
        const portalMenus = data.data?.PortalMenus;
        const PortalCurrentUser = data.data?.PortalCurrentUser;
        localStorage.setItem('Phoenix:token', token);
        localStorage.setItem('x-auth-token', token);
        localStorage.setItem('PortalMenus', JSON.stringify(portalMenus));
        localStorage.setItem('Phoenix:config', JSON.stringify(PhoenixConfig));
        localStorage.setItem('PortalCurrentUser', JSON.stringify(PortalCurrentUser));
        resolve(true);
      }
      if (data.type === 'route') {
        history.push(data.data.path);
      }
    });
  });
};

const handleToPortal = () => {
  // 发送消息
  const params = {
    type: 'isReady',
    data: true,
  };
  window.top?.postMessage(params, '*');
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: PhoenixAPI.CurrentUser;
}> {
  // 检测是否为本地开发环境
  const isLocalDev = isLocalDevelopment();

  if (isLocalDev) {
    // 本地开发环境：使用本地菜单和权限
    console.log('检测到本地开发环境，使用本地配置');

    // 使用统一的权限配置
    const defaultPermissions = createLocalDevPermissions();

    // 默认用户信息
    const currentUser: PhoenixAPI.CurrentUser = {
      name: '开发用户',
      avatar: '/images/bcsLogo.png',
      menus: [], // 本地开发时使用路由配置，不需要菜单数据
      permissions: defaultPermissions,
    };

    return {
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  } else {
    const currentUser = {
      menus: [],
      permissions: [],
    };
    return {
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  const isLocalDev = isLocalDevelopment();

  return {
    actionsRender: () => [<Question key="doc" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    onPageChange: () => ({}),
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      if (initialState?.loading) return <PageLoading />;
      return (
        <ConfigProvider locale={locale}>
          <App>
            {children}
            {(isDev || isLocal) && (
              <SettingDrawer
                disableUrlParams
                enableDarkTheme
                settings={initialState?.settings}
                onSettingChange={(settings) => {
                  setInitialState((preInitialState) => ({
                    ...preInitialState,
                    settings,
                  }));
                }}
              />
            )}
          </App>
        </ConfigProvider>
      );
    },
    ...initialState?.settings,
    // 从服务端获取菜单时，释放 menu 对象
    // menu: {
    //   // 每当 initialState 发生修改时重新执行 request
    //   params: initialState,
    //   request: async (params, defaultMenuData) => {
    //     const menuData = adoptorMenus(initialState?.currentUser?.routers || []);
    //     return menuData;
    //   },
    // },
  };
};

export const qiankun = {
  async bootstrap(props: any) {
    console.log('afs bootstrap: ', props);
  },
  async mount(props: any) {
    console.log('afs mount: ', props);
    setMasterProps(props);
  },
  async unmount(props: any) {
    console.log('afs unmount: ', props);
  },
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
