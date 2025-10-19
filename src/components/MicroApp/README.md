# qiankun 微前端解决方案

本项目已集成 qiankun 微前端框架，支持作为子应用运行在微前端架构中。

## 功能特性

- ✅ **子应用支持**: 可以作为 qiankun 子应用运行
- ✅ **生命周期管理**: 支持 bootstrap、mount、unmount 生命周期
- ✅ **通信机制**: 支持与主应用的双向通信
- ✅ **状态管理**: 支持全局状态共享和管理
- ✅ **路由管理**: 支持微前端路由导航
- ✅ **独立运行**: 支持独立运行和微前端模式切换

## 核心配置

### 1. 基础配置

在 `src/config/config.ts` 中配置 qiankun：

```typescript
export default defineConfig({
  // ... 其他配置
  qiankun: {
    slave: {},
  },
});
```

### 2. 应用入口配置

在 `src/app.tsx` 中配置生命周期：

```typescript
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
```

### 3. 公共路径配置

在 `src/public-path.js` 中配置公共路径：

```javascript
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
  window.publicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

## 工具函数

### 1. 微前端环境检测

```typescript
import { isMicroApp, getMicroAppName, getMicroAppPublicPath } from '../../utils/microApp';

// 检查是否在微前端环境中
const isInMicroApp = isMicroApp();

// 获取微前端应用名称
const appName = getMicroAppName();

// 获取微前端公共路径
const publicPath = getMicroAppPublicPath();
```

### 2. 主应用通信

```typescript
import { microAppCommunication } from '../../utils/microApp';

// 发送消息到主应用
microAppCommunication.emit('userLogin', { userId: '123', userName: 'admin' });

// 监听主应用消息
const cleanup = microAppCommunication.on('themeChange', (theme) => {
  console.log('主题已切换:', theme);
});

// 请求主应用数据
const userInfo = await microAppCommunication.request('getUserInfo', { userId: '123' });
```

### 3. 状态管理

```typescript
import { microAppState } from '../../utils/microApp';

// 设置状态
microAppState.setState('userPreferences', { theme: 'dark', language: 'en' });

// 获取状态
const preferences = microAppState.getState('userPreferences');

// 清除状态
microAppState.clearState('userPreferences');
```

### 4. 路由管理

```typescript
import { microAppRouter } from '../../utils/microApp';

// 跳转到其他微前端应用
microAppRouter.navigateToMicroApp('cas-front', '/dashboard');

// 获取当前路径
const currentPath = microAppRouter.getCurrentMicroAppPath();

// 检查是否在指定应用中
const isInCas = microAppRouter.isInMicroApp('cas-front');
```

### 5. 生命周期管理

```typescript
import { microAppLifecycle } from '../../utils/microApp';

// 应用挂载时执行
microAppLifecycle.onMount(() => {
  console.log('应用已挂载');
});

// 应用卸载时执行
microAppLifecycle.onUnmount(() => {
  console.log('应用即将卸载');
});
```

## 使用示例

### 1. 基础微前端组件

```tsx
import React, { useEffect, useState } from 'react';
import { Card, Button, message } from 'antd';
import { isMicroApp, getMasterAppProps, microAppCommunication } from '../../utils/microApp';

const MicroAppComponent = () => {
  const [masterProps, setMasterProps] = useState({});
  const [isInMicroApp, setIsInMicroApp] = useState(false);

  useEffect(() => {
    setIsInMicroApp(isMicroApp());
    setMasterProps(getMasterAppProps());
  }, []);

  const handleSendMessage = () => {
    microAppCommunication.emit('testMessage', {
      timestamp: new Date().toISOString(),
      data: 'Hello from micro app!',
    });
    message.success('消息已发送');
  };

  return (
    <Card title="微前端组件">
      <p>是否在微前端环境: {isInMicroApp ? '是' : '否'}</p>
      <p>主应用属性: {JSON.stringify(masterProps)}</p>
      <Button onClick={handleSendMessage}>发送消息到主应用</Button>
    </Card>
  );
};
```

### 2. 状态同步组件

```tsx
import React, { useEffect, useState } from 'react';
import { Card, Button, Input, message } from 'antd';
import { microAppState, microAppCommunication } from '../../utils/microApp';

const StateSyncComponent = () => {
  const [localState, setLocalState] = useState('');
  const [globalState, setGlobalState] = useState('');

  useEffect(() => {
    // 获取全局状态
    const state = microAppState.getState('sharedData');
    setGlobalState(state || '');

    // 监听状态变化
    const cleanup = microAppCommunication.on('stateChange', (newState) => {
      setGlobalState(newState);
    });

    return cleanup;
  }, []);

  const handleUpdateState = () => {
    // 更新本地状态
    microAppState.setState('sharedData', localState);

    // 通知其他应用状态变化
    microAppCommunication.emit('stateChange', localState);

    message.success('状态已更新');
  };

  return (
    <Card title="状态同步">
      <div style={{ marginBottom: 16 }}>
        <Input
          value={localState}
          onChange={(e) => setLocalState(e.target.value)}
          placeholder="输入状态数据"
        />
        <Button onClick={handleUpdateState} style={{ marginLeft: 8 }}>
          更新状态
        </Button>
      </div>
      <div>
        <p>全局状态: {globalState}</p>
      </div>
    </Card>
  );
};
```

### 3. 路由导航组件

```tsx
import React from 'react';
import { Card, Button, Space } from 'antd';
import { microAppRouter } from '../../utils/microApp';

const NavigationComponent = () => {
  const handleNavigateToCas = () => {
    microAppRouter.navigateToMicroApp('cas-front', '/dashboard');
  };

  const handleNavigateToDashboard = () => {
    microAppRouter.navigateToMicroApp('anti-fraud-frontend', '/dashboard');
  };

  return (
    <Card title="微前端导航">
      <Space>
        <Button onClick={handleNavigateToCas}>跳转到 CAS 系统</Button>
        <Button onClick={handleNavigateToDashboard}>跳转到仪表盘</Button>
      </Space>
    </Card>
  );
};
```

## 主应用配置

### 1. 安装依赖

```bash
npm install qiankun
```

### 2. 主应用配置

```typescript
import { registerMicroApps, start, initGlobalState } from 'qiankun';

// 初始化全局状态
const actions = initGlobalState({
  user: null,
  theme: 'light',
});

// 注册微应用
registerMicroApps([
  {
    name: 'anti-fraud-frontend',
    entry: '//localhost:8000',
    container: '#subapp-viewport',
    activeRule: '/anti-fraud',
    props: {
      basename: '/anti-fraud',
      getGlobalState: actions.getGlobalState,
      setGlobalState: actions.setGlobalState,
      onGlobalStateChange: actions.onGlobalStateChange,
    },
  },
]);

// 启动 qiankun
start();
```

### 3. 主应用路由

```tsx
import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

const MasterApp = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Layout.Sider>
        <Menu
          items={[
            {
              key: 'anti-fraud',
              label: '反欺诈系统',
              onClick: () => navigate('/anti-fraud'),
            },
            {
              key: 'cas',
              label: 'CAS系统',
              onClick: () => navigate('/cas'),
            },
          ]}
        />
      </Layout.Sider>
      <Layout.Content>
        <div id="subapp-viewport" />
      </Layout.Content>
    </Layout>
  );
};
```

## 部署配置

### 1. 子应用部署

```bash
# 构建子应用
npm run build

# 部署到服务器
# 确保子应用可以通过独立域名访问
```

### 2. 主应用部署

```bash
# 构建主应用
npm run build

# 部署到服务器
# 配置 nginx 代理子应用
```

### 3. Nginx 配置示例

```nginx
server {
    listen 80;
    server_name master.example.com;

    # 主应用
    location / {
        root /var/www/master;
        try_files $uri $uri/ /index.html;
    }

    # 反欺诈子应用
    location /anti-fraud {
        proxy_pass http://anti-fraud.example.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # CAS子应用
    location /cas {
        proxy_pass http://cas.example.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 最佳实践

1. **状态管理**: 使用全局状态管理共享数据，避免直接操作 DOM
2. **通信机制**: 使用事件通信而非直接调用，保持应用间解耦
3. **路由管理**: 使用微前端路由工具，避免直接操作浏览器历史
4. **生命周期**: 在适当的生命周期钩子中执行初始化和清理操作
5. **错误处理**: 添加错误边界和异常处理，确保子应用崩溃不影响主应用
6. **性能优化**: 使用懒加载和代码分割，减少初始加载时间

## 调试技巧

1. **控制台日志**: 在生命周期钩子中添加日志，监控应用状态
2. **网络面板**: 检查子应用资源加载情况
3. **应用面板**: 使用浏览器开发者工具监控应用状态
4. **通信调试**: 在通信函数中添加日志，跟踪消息传递

## 常见问题

### Q: 子应用无法加载？

A: 检查子应用的 entry 地址是否正确，确保子应用可以独立访问。

### Q: 样式冲突？

A: 使用 CSS 作用域隔离，或者在 qiankun 配置中启用样式隔离。

### Q: 路由问题？

A: 确保子应用的路由配置与主应用的路由规则匹配。

### Q: 通信失败？

A: 检查主应用是否正确传递了通信相关的 props。

## 参考文档

- [qiankun 官方文档](https://qiankun.umijs.org/zh)
- [微前端架构设计](https://micro-frontends.org/)
- [qiankun 最佳实践](https://qiankun.umijs.org/zh/guide/best-practice)

