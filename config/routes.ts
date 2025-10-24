/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */

export default [
  {
    path: '/',
    redirect: '/event/list',
  },
  {
    path: '/event',
    name: '事件管理',
    icon: 'NotificationOutlined',
    access: '/event',
    routes: [
      {
        path: '/event/list',
        name: '事件列表',
        component: './EventList',
        access: 'antifraud:event:readonly',
      },
      {
        path: '/event/detail-list',
        name: '事件明细',
        component: './EventDetailList',
        access: 'antifraud:event:readonly',
      },
      {
        path: '/event/version-list',
        name: '事件版本',
        component: './EventVersionList',
        access: 'antifraud:event:readonly',
      },
      {
        path: '/event/config',
        name: '事件配置',
        component: './EventConfigNew',
        hideInMenu: true,
        access: 'antifraud:event:readonly',
      },
    ],
  },
  {
    path: '/field',
    name: '字段管理',
    icon: 'FieldBinaryOutlined',
    access: '/field',
    routes: [
      {
        path: '/field/list',
        name: '事件字段',
        component: './FieldList',
        access: 'antifraud:field:readonly',
      },
      {
        path: '/field/derive/list',
        name: '衍生字段',
        component: './DeriveFieldList',
        access: 'antifraud:field:readonly',
      },
    ],
  },
  {
    path: '/stage',
    name: '阶段管理',
    icon: 'DeploymentUnitOutlined',
    access: '/stage',
    routes: [
      {
        path: '/stage/list',
        name: '阶段',
        component: './StageList',
        access: 'antifraud:stage:readonly',
      },
    ],
  },
  {
    path: '/statement',
    name: '语句管理',
    icon: 'DeploymentUnitOutlined',
    access: '/statement',
    routes: [
      {
        path: '/statement/list',
        name: '处理语句',
        component: './StatementList',
        access: 'antifraud:statement:readonly',
      },
      {
        path: '/statement/dependency/list',
        name: '语句依赖',
        component: './StatementDependencyList',
        access: 'antifraud:statement:readonly',
      },
    ],
  },
  {
    path: '/indicator',
    name: '指标管理',
    icon: 'BarChartOutlined',
    access: '/indicator',
    routes: [
      {
        path: '/indicator/list',
        name: '指标列表',
        component: './IndicatorList',
        access: 'antifraud:indicator:readonly',
      },
      {
        path: '/indicator/relation/list',
        name: '事件指标关联',
        component: './EventIndicatorList',
        access: 'antifraud:indicator:readonly',
      },
    ],
  },
  {
    path: '/datasource',
    name: '数据源管理',
    icon: 'DatabaseOutlined',
    access: '/datasource',
    routes: [
      {
        path: '/datasource/list',
        name: '数据源配置',
        component: './DataSourceList',
        access: 'antifraud:datasource:readonly',
      },
    ],
  },
  {
    path: '/dict',
    name: '字典配置管理',
    icon: 'DatabaseOutlined',
    access: '/dict',
    routes: [
      {
        path: '/dict/list',
        name: '字典配置',
        component: './SystemDictList',
        access: 'antifraud:dict:readonly',
      },
    ],
  },
  {
    path: '/anti-fraud',
    name: '反欺诈管理',
    icon: 'SecurityScanOutlined',
    access: '/anti-fraud',
    routes: [
      {
        path: '/anti-fraud/dashboard',
        name: '数据仪表盘',
        component: './AntiFraudDashboard',
        access: 'antifraud:dashboard:readonly',
      },
      {
        path: '/anti-fraud/rules',
        name: '规则管理',
        component: './AntiFraudRuleManagement',
        access: 'antifraud:rule:readonly',
      },
    ],
  },
];
