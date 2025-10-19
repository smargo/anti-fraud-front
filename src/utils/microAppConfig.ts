// 微前端主应用配置示例
// 这个文件展示了如何配置主应用来加载 anti-fraud-frontend 作为子应用

import { registerMicroApps, start, initGlobalState } from 'qiankun';

// 全局状态
const actions = initGlobalState({
  user: null,
  theme: 'light',
  language: 'zh-CN',
});

// 微应用配置
const microApps = [
  {
    name: 'anti-fraud-frontend',
    entry: '//localhost:8000',
    container: '#subapp-viewport',
    activeRule: '/anti-fraud',
    props: {
      basename: '/anti-fraud',
      // 传递全局状态
      getGlobalState: actions.getGlobalState,
      setGlobalState: actions.setGlobalState,
      onGlobalStateChange: actions.onGlobalStateChange,
    },
  },
  {
    name: 'cas-front',
    entry: '//localhost:8001',
    container: '#subapp-viewport',
    activeRule: '/cas',
    props: {
      basename: '/cas',
      getGlobalState: actions.getGlobalState,
      setGlobalState: actions.setGlobalState,
      onGlobalStateChange: actions.onGlobalStateChange,
    },
  },
];

// 注册微应用
registerMicroApps(microApps, {
  beforeLoad: (app) => {
    console.log('before load', app);
    return Promise.resolve();
  },
  beforeMount: (app) => {
    console.log('before mount', app);
    return Promise.resolve();
  },
  afterMount: (app) => {
    console.log('after mount', app);
    return Promise.resolve();
  },
  beforeUnmount: (app) => {
    console.log('before unmount', app);
    return Promise.resolve();
  },
  afterUnmount: (app) => {
    console.log('after unmount', app);
    return Promise.resolve();
  },
});

// 启动 qiankun
start({
  sandbox: {
    strictStyleIsolation: true,
  },
  prefetch: 'all',
});

// 导出全局状态操作
export { actions };

// 主应用示例代码
/*
import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { actions } from './microAppConfig';

const { Header, Content, Sider } = Layout;

const MasterApp = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // 监听全局状态变化
    actions.onGlobalStateChange((state, prev) => {
      console.log('全局状态变化:', state, prev);
      setUser(state.user);
    }, true);
  }, []);

  const handleLogin = () => {
    const userInfo = { id: '1', name: 'Admin', role: 'admin' };
    setUser(userInfo);
    actions.setGlobalState({ user: userInfo });
  };

  const handleLogout = () => {
    setUser(null);
    actions.setGlobalState({ user: null });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
          微前端主应用
        </div>
        <div>
          {user ? (
            <Button onClick={handleLogout}>退出登录</Button>
          ) : (
            <Button type="primary" onClick={handleLogin}>登录</Button>
          )}
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              {
                key: '1',
                label: '反欺诈系统',
                onClick: () => {
                  window.history.pushState(null, '', '/anti-fraud');
                },
              },
              {
                key: '2',
                label: 'CAS系统',
                onClick: () => {
                  window.history.pushState(null, '', '/cas');
                },
              },
            ]}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <div id="subapp-viewport" style={{ width: '100%', height: '100%' }} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MasterApp;
*/

