import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { App, ConfigProvider, message } from 'antd';
import locale from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { createLocalDevPermissions } from './constants/permissions';
import { isLocalDevelopment } from './utils';
import { setMasterProps } from './utils/masterProps';
import { GlobalHeaderRight } from './components/RightContent';
import Footer from './components/Footer';

dayjs.locale('zh-cn');

// message 配置
message.config({
  top: 100,
  duration: 2,
  maxCount: 2,
});

// 运行时配置
export const getInitialState = async (): Promise<{
  currentUser?: PhoenixAPI.CurrentUser;
  settings?: Partial<PhoenixAPI.LayoutSettings>;
}> => {
  // 本地开发环境：提供模拟用户数据
  if (isLocalDevelopment()) {
    console.log('本地开发环境：初始化用户状态');
    return {
      currentUser: {
        id: 'dev-user',
        username: '开发用户',
        name: '开发用户',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        email: 'dev@example.com',
        signature: '开发环境用户',
        title: '开发工程师',
        group: '开发组',
        tags: [{ key: '0', label: '开发' }],
        notifyCount: 0,
        unreadCount: 0,
        country: 'China',
        access: 'admin',
        geographic: {
          province: { label: '广东省', key: '440000' },
          city: { label: '深圳市', key: '440300' },
        },
        address: '深圳市南山区',
        phone: '13800138000',
        authorities: createLocalDevPermissions(),
        permissions: createLocalDevPermissions(),
        menus: [],
      },
      settings: {
        navTheme: 'light',
        primaryColor: '#1890ff',
        layout: 'mix',
        contentWidth: 'Fluid',
        fixedHeader: false,
        fixSiderbar: true,
        colorWeak: false,
        title: '反欺诈系统',
        pwa: true,
        logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjRwkS.svg',
        iconfontUrl: '',
        splitMenus: false,
      },
    };
  }

  // 生产环境：从服务器获取用户信息
  try {
    // const msg = await fetchUserInfo();
    // return msg;
    return {};
  } catch (error) {
    history.push('/user/login');
    return {};
  }
};

// ProLayout 支持的API
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <GlobalHeaderRight />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== '/user/login') {
        history.push('/user/login');
      }
    },
    links: [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <ConfigProvider locale={locale}>
          <App>{children}</App>
        </ConfigProvider>
      );
    },
    ...initialState?.settings,
  };
};

// 应用容器配置
export function rootContainer(container: React.ReactElement) {
  return (
    <ConfigProvider locale={locale}>
      <App>{container}</App>
    </ConfigProvider>
  );
}

// qiankun 微前端配置
export const qiankun = {
  async bootstrap(props: any) {
    console.log('anti-fraud bootstrap: ', props);
  },
  async mount(props: any) {
    console.log('anti-fraud mount: ', props);
    setMasterProps(props);
  },
  async unmount(props: any) {
    console.log('anti-fraud unmount: ', props);
  },
};
